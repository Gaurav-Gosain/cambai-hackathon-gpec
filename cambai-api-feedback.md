# Feedback/Suggestions for CAMB.AI's APIs

- Support `webm`/`mp4` video inputs for the dubbing API
- If possible allow directly uploading files through the standard HTTP
  multipart forms.
- For the polling endpoints, return the current progress or the time remaining,
  or at the very least the current step.
- Better docs. The current docs do not provide with proper examples or shape of
  the returned data, all they say is `"<any>"` which is not helpful when
  developing for the first time or getting started with the APIs.
- Since the original video itself is also stored somewhere (clear from the
  studio) an API to be able to download the original video (so that the API
  users don't have to save their own copy of the same videos on their own servers!)
- Ability to specify which audio and video formats to get from the
  `apis/dubbed_run_info/{run_id}` endpoint (as its clear from the export screen
  in the studio that it is possible to get different formats like `.mkv`,
  `.flac`, `.mp4`, `.mp3` etc.) along with the ability to download the `.srt`
  files as this would unlock a lot of other possibilities!
