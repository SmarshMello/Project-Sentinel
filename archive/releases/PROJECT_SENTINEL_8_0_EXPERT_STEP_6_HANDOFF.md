# Project Sentinel 8.0 — Expert Step 6: Strict Unknown Detection

## Fixes
- Project names now require complete phrase or token matches.
- Short codes such as `SUP`, `UB`, and `RPH` no longer match words like `super` or `support`.
- Unknown names immediately produce an unknown-project verdict instead of borrowing unrelated registry records.
- Automatic Watcher research now receives the actual unknown name after React state updates.

## Research safety
- Watcher searches multiple GitHub queries and scores candidates for name overlap, LSPDFR/GTA context, freshness, and source activity.
- A project is added automatically only when a candidate clears the credibility threshold.
- Automatic additions are always marked `Research`, `Pending review`, and `Not verified`.
- If no credible source is found, the request is saved for manual research and no public database entry is invented.

## Test
Ask: `Can I use Example Police super store Mod with EUP?`
Expected: EUP is recognized, the fake name is reported as unknown, and Watcher research is queued.
