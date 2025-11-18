import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

// ---------------------- helpers ----------------------
async function requireUser() {
  const session = await getServerSession(OPTIONS);
  if (!session?.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      rooms: { include: { items: true } },
    },
  });
  if (!user) redirect("/");
  return user;
}

// ---------------------- server actions ----------------------
export async function createClaim(formData: FormData) {
  'use server';
  const user = await requireUser();

  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const incidentDateRaw = String(formData.get('incidentDate') || '').trim();
  const collaboratorStr = String(formData.get('collaborators') || '').trim();
  const itemIds = (formData.getAll('itemIds') as string[]).filter(Boolean);

  if (!title || !incidentDateRaw || itemIds.length === 0) {
    throw new Error('Missing required fields. Title, date and at least one item are required.');
  }

  const incidentDate = new Date(incidentDateRaw);

  // normalize collaborator emails
  const collaboratorEmails = collaboratorStr
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e && e !== user.email);

  // Ensure users for collaborators exist (create placeholders if not)
  const collaborators = await Promise.all(collaboratorEmails.map(async email => {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: email.split('@')[0] },
    });
  }));

  const claim = await prisma.claim.create({
    data: {
      title,
      description,
      incidentDate,
      status: 'DRAFT',
      createdById: user.id,
      participants: {
        create: [
          { userId: user.id, role: 'OWNER' },
          ...collaborators.map(u => ({ userId: u.id, role: 'COLLABORATOR' as const }))
        ]
      },
      items: {
        create: itemIds.map(id => ({ item: { connect: { id } } }))
      }
    }
  });

  revalidatePath('/collaboration');
  redirect(`/collaboration?created=${claim.id}`);
}

export async function addComment(formData: FormData) {
  'use server';
  const user = await requireUser();
  const claimId = String(formData.get('claimId'));
  const body = String(formData.get('body') || '').trim();
  if (!claimId || !body) return;

  await prisma.claimComment.create({
    data: {
      body,
      claimId,
      authorId: user.id
    }
  });
  revalidatePath('/collaboration');
}

export async function updateStatus(formData: FormData) {
  'use server';
  const claimId = String(formData.get('claimId'));
  const status = String(formData.get('status')) as any;
  if (!claimId || !status) return;
  await prisma.claim.update({ where: { id: claimId }, data: { status } });
  revalidatePath('/collaboration');
}

export async function inviteCollaborators(formData: FormData) {
  'use server';
  const claimId = String(formData.get('claimId'));
  const collaboratorStr = String(formData.get('collaborators') || '').trim();
  if (!claimId || !collaboratorStr) return;

  const emails = collaboratorStr.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  const users = await Promise.all(emails.map(email => prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: email.split('@')[0] }
  })));

  await prisma.claimParticipant.createMany({
    data: users.map(u => ({ claimId, userId: u.id, role: 'COLLABORATOR' })),
    skipDuplicates: true
  });
  revalidatePath('/collaboration');
}

// ---------------------- main page ----------------------
export default async function CollaborationPage() {
  const user = await requireUser();

  const claims = await prisma.claim.findMany({
    where: { participants: { some: { userId: user.id } } },
    include: {
      items: { include: { item: true } },
      participants: { include: { user: true } },
      comments: { include: { author: true }, orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Collaborate on Claims</h1>
          <p className="text-sm text-muted-foreground">Create a claim, invite collaborators, attach items, and track status.</p>
        </div>
        <Link href="/" className="text-sm underline">Back to dashboard</Link>
      </div>

      {/* Create claim */}
      <div className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Create a new claim</h2>
        <form action={createClaim} className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2 grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input name="title" className="rounded-xl border px-3 py-2" placeholder="Broken TV in Living Room" required />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Incident date</label>
            <input type="date" name="incidentDate" className="rounded-xl border px-3 py-2" required />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Invite collaborators (emails, comma separated)</label>
            <input name="collaborators" className="rounded-xl border px-3 py-2" placeholder="sam@example.com, alex@work.biz" />
          </div>
          <div className="col-span-2 grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" rows={3} className="rounded-xl border px-3 py-2" placeholder="What happened? Provide as much detail as possible." />
          </div>

          <div className="col-span-2 grid gap-3">
            <label className="text-sm font-medium">Select items to include</label>
            <div className="grid gap-3 md:grid-cols-2">
              {user.rooms.map(r => (
                <fieldset key={r.id} className="rounded-xl border p-3">
                  <legend className="px-1 text-sm font-semibold text-muted-foreground">{r.name}</legend>
                  <div className="grid gap-2">
                    {r.items.length === 0 && (
                      <p className="text-sm text-muted-foreground">No items in this room.</p>
                    )}
                    {r.items.map(it => (
                      <label key={it.id} className="flex items-center gap-3">
                        <input type="checkbox" name="itemIds" value={it.id} />
                        <span className="text-sm">{it.name} <span className="text-muted-foreground">(${Number(it.value || 0)})</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <div className="col-span-2 flex justify-end">
            <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Create claim</button>
          </div>
        </form>
      </div>

      {/* Existing claims list */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Your collaborative claims</h2>
        {claims.length === 0 && (
          <p className="text-sm text-muted-foreground">No claims yet. Create one above and invite others to help.</p>
        )}
        <div className="grid gap-4">
          {claims.map(c => (
            <div key={c.id} className="rounded-2xl border bg-white/70 backdrop-blur p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">Incident on {new Date(c.incidentDate).toLocaleDateString()}</p>
                </div>
                <form action={updateStatus} className="flex items-center gap-2">
                  <input type="hidden" name="claimId" value={c.id} />
                  <select name="status" defaultValue={c.status} className="rounded-xl border px-3 py-2 text-sm">
                    <option value="DRAFT">Draft</option>
                    <option value="GATHERING_EVIDENCE">Gathering Evidence</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <button className="rounded-xl border px-3 py-2 text-sm">Update</button>
                </form>
              </div>

              {/* participants */}
              <div className="mt-4 grid gap-2">
                <div className="text-sm font-medium">Participants</div>
                <div className="flex flex-wrap gap-2">
                  {c.participants.map(p => (
                    <span key={p.userId} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
                      {p.user?.name || p.user?.email} {p.role === 'OWNER' ? '(owner)' : ''}
                    </span>
                  ))}
                </div>
                <form action={inviteCollaborators} className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="claimId" value={c.id} />
                  <input name="collaborators" placeholder="invite emails" className="min-w-[240px] flex-1 rounded-xl border px-3 py-2 text-sm" />
                  <button className="rounded-xl border px-3 py-2 text-sm">Invite</button>
                </form>
              </div>

              {/* items */}
              <div className="mt-4 grid gap-2">
                <div className="text-sm font-medium">Items</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {c.items.map(ci => (
                    <div key={ci.id} className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <div className="text-sm font-medium">{ci.item.name}</div>
                        <div className="text-xs text-muted-foreground">Value: ${Number(ci.item.value || 0)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">#{ci.item.id.slice(0,6)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* comments */}
              <div className="mt-4 grid gap-3">
                <div className="text-sm font-medium">Discussion</div>
                <form action={addComment} className="flex gap-2">
                  <input type="hidden" name="claimId" value={c.id} />
                  <input name="body" placeholder="Share an update, link, receipt…" className="flex-1 rounded-xl border px-3 py-2 text-sm" />
                  <button className="rounded-xl border px-3 py-2 text-sm">Post</button>
                </form>
                <div className="grid gap-2">
                  {c.comments.map(cm => (
                    <div key={cm.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs text-muted-foreground">
                        {cm.author?.name || cm.author?.email} • {new Date(cm.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm">{cm.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Prisma schema additions (place in prisma/schema.prisma)
// Add these models if you don't already have them. Then run:
//   npx prisma migrate dev -n add_claim_collab
// -------------------------------------------------------------
/*
model Claim {
  id           String            @id @default(cuid())
  title        String
  description  String?
  incidentDate DateTime
  status       ClaimStatus       @default(DRAFT)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  // relations
  createdBy    User              @relation(fields: [createdById], references: [id])
  createdById  String
  participants ClaimParticipant[]
  items        ClaimItem[]
  comments     ClaimComment[]
}

enum ClaimStatus {
  DRAFT
  GATHERING_EVIDENCE
  SUBMITTED
  APPROVED
  REJECTED
}

model ClaimParticipant {
  id      String   @id @default(cuid())
  role    Role     @default(COLLABORATOR)
  user    User     @relation(fields: [userId], references: [id])
  userId  String
  claim   Claim    @relation(fields: [claimId], references: [id])
  claimId String

  @@unique([userId, claimId])
}

enum Role {
  OWNER
  COLLABORATOR
}

model ClaimItem {
  id      String @id @default(cuid())
  claim   Claim  @relation(fields: [claimId], references: [id])
  claimId String
  item    Item   @relation(fields: [itemId], references: [id])
  itemId  String

  @@unique([claimId, itemId])
}

model ClaimComment {
  id        String   @id @default(cuid())
  body      String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  claim     Claim    @relation(fields: [claimId], references: [id])
  claimId   String
}
*/
