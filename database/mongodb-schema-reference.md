# MongoDB Schema (Mongoose)

The canonical Mongoose models live in `backend/models/` and are used directly
by the API — this file is a quick reference for how the collections relate.

| Collection  | File                          | Key relationships |
|-------------|-------------------------------|--------------------|
| `users`     | `backend/models/User.js`      | Referenced by Jobs (`client`, `assignedFreelancer`), Proposals (`freelancer`), Messages (`sender`, `recipient`), Payments (`client`, `freelancer`), Reviews (`reviewer`, `reviewee`) |
| `jobs`      | `backend/models/Job.js`       | `client` → User, `assignedFreelancer` → User; referenced by Proposals, Messages, Payments, Reviews via `job` |
| `proposals` | `backend/models/Proposal.js`  | `job` → Job, `freelancer` → User. Unique index on `(job, freelancer)` prevents duplicate bids. |
| `messages`  | `backend/models/Message.js`   | `job` → Job, `sender`/`recipient` → User |
| `payments`  | `backend/models/Payment.js`   | `job` → Job, `client`/`freelancer` → User |
| `reviews`   | `backend/models/Review.js`    | `job` → Job, `reviewer`/`reviewee` → User. Unique index on `(job, reviewer)` prevents duplicate reviews. |

## Constraints enforced at the schema level

- `User.email` — `unique: true` (no two accounts can share an email)
- `User.role` — `enum: ["client", "freelancer", "admin"]`
- `Job.status` — `enum: ["open", "in-progress", "completed", "cancelled"]`
- `Proposal.status` — `enum: ["pending", "accepted", "rejected", "withdrawn"]`
- `Payment.status` — `enum: ["pending", "succeeded", "failed", "refunded"]`
- `Proposal` and `Review` both use compound unique indexes to stop duplicate
  bids/reviews on the same job by the same user.

## Example: fetching a job with its proposals and messages

```js
const job = await Job.findById(jobId)
  .populate("client", "name email")
  .populate("assignedFreelancer", "name email");

const proposals = await Proposal.find({ job: jobId }).populate("freelancer", "name skills");
const messages = await Message.find({ job: jobId }).sort({ createdAt: 1 });
```

For the SQL/relational equivalent of this same schema (useful if you'd
rather run on PostgreSQL or MySQL), see `schema.sql` in this folder.
