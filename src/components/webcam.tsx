import React, { useEffect } from "react";
import { useRecordWebcam } from "react-record-webcam";
import { SelectCustom } from "./select";
import pb from "@/lib/pocketbase";
import { AuthModel } from "pocketbase";
import { Button } from "./ui/button";
import { useLoadingStore } from "@/lib/stores/loading-store";

const Webcam = ({ user }: { user: AuthModel }) => {
  const {
    activeRecordings,
    cancelRecording,
    clearAllRecordings,
    clearError,
    clearPreview,
    closeCamera,
    createRecording,
    devicesById,
    devicesByType,
    errorMessage,
    muteRecording,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam({
    mediaTrackConstraints: { video: true, audio: true } as any,
  });

  const [videoDeviceId, setVideoDeviceId] = React.useState<string>("");
  const [audioDeviceId, setAudioDeviceId] = React.useState<string>("");
  const [finalRecording, setFinalRecording] = React.useState<any>(null);
  const [email, setEmail] = React.useState<string>("");

  const { setLoading } = useLoadingStore();

  interface Languages {
    id: number;
    language: string;
    short_name: string;
  }

  const [source, setSource] = React.useState<Languages[]>([]);
  const [target, setTarget] = React.useState<Languages[]>([]);

  const [selectedSourceId, setSelectedSourceId] = React.useState<string>("");
  const [selectedTargetId, setSelectedTargetId] = React.useState<string>("");

  // useEffect(() => {
  //   fetch("/api/source").then(async (res) => {
  //     const json = await res.json();
  //     setSource(json);
  //   });
  //
  //   fetch("/api/target").then(async (res) => {
  //     const json = await res.json();
  //     setTarget(json);
  //   });
  // }, []);

  const quickDemo = async () => {
    try {
      const recording = await createRecording();
      if (!recording) return;
      await openCamera(recording.id);
      await startRecording(recording.id);
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await stopRecording(recording.id);
      await closeCamera(recording.id);
    } catch (error) {
      console.log({ error });
    }
  };

  const start = async () => {
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
  };

  useEffect(() => {
    if (audioDeviceId && videoDeviceId) start();
    return () => {
      clearAllRecordings();
    };
  }, [videoDeviceId, audioDeviceId]);

  return (
    <div className="flex w-screen h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
      {!finalRecording && activeRecordings.length == 0 && (
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-4">
          <SelectCustom
            items={devicesByType?.video || []}
            dataset="deviceid"
            placeholder="Select a camera"
            onChange={(deviceID: string) => setVideoDeviceId(deviceID)}
          />
          <SelectCustom
            items={devicesByType?.audio || []}
            dataset="deviceid"
            placeholder="Select a mic"
            onChange={(deviceID: string) => setAudioDeviceId(deviceID)}
          />
        </div>
      )}

      {activeRecordings.length == 0 && videoDeviceId && audioDeviceId && (
        <Button onClick={start}>Open camera</Button>
      )}

      {/* <div className="space-x-2"> */}
      {/*   <Button onClick={quickDemo}>Record 30s video</Button> */}
      {/*   {activeRecordings.length == 0 && ( */}
      {/*     <Button onClick={start}>Open camera</Button> */}
      {/*   )} */}
      {/*   <Button onClick={() => clearAllRecordings()}>Clear all</Button> */}
      {/*   <Button onClick={() => clearError()}>Clear error</Button> */}
      {/* </div> */}
      {/* <div className="my-2"> */}
      {/*   <p>{errorMessage ? `Error: ${errorMessage}` : ""}</p> */}
      {/* </div> */}
      <div className="grid grid-cols-custom gap-4 my-4">
        {activeRecordings?.map((recording) => (
          <div className="rounded-lg px-4 py-4" key={recording.id}>
            {/* <div className="grid grid-cols-1"> */}
            {/*   <p>Live</p> */}
            {/*   <small>Status: {recording.status}</small> */}
            {/*   <small>Video: {recording.videoLabel}</small> */}
            {/*   <small>Audio: {recording.audioLabel}</small> */}
            {/* </div> */}
            {!finalRecording && (
              <div className="relative">
                {recording.status === "RECORDING" && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 justify-center">
                    <div className="h-5 w-5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-md font-medium">Recording</span>
                  </div>
                )}
                <video
                  ref={recording.webcamRef}
                  className="rounded-xl"
                  loop
                  autoPlay
                  playsInline
                  muted
                />
                <div className="space-x-1 space-y-1 my-2">
                  <Button
                    disabled={
                      recording.status === "RECORDING" ||
                      recording.status === "PAUSED"
                    }
                    onClick={() => startRecording(recording.id)}
                  >
                    Record
                  </Button>
                  <Button
                    disabled={
                      recording.status !== "RECORDING" &&
                      recording.status !== "PAUSED"
                    }
                    // toggled={recording.status === "PAUSED"}
                    onClick={() =>
                      recording.status === "PAUSED"
                        ? resumeRecording(recording.id)
                        : pauseRecording(recording.id)
                    }
                  >
                    {recording.status === "PAUSED" ? "Resume" : "Pause"}
                  </Button>
                  <Button
                    // toggled={recording.isMuted}
                    onClick={() => muteRecording(recording.id)}
                  >
                    Mute
                  </Button>
                  <Button
                    onClick={async () => {
                      const res = await stopRecording(recording.id);
                      setFinalRecording(res);
                      console.log(res);
                    }}
                  >
                    Stop
                  </Button>
                  <Button onClick={() => cancelRecording(recording.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div
              className={`${
                recording.previewRef.current?.src.startsWith("blob:")
                  ? "visible"
                  : "hidden"
              }`}
            >
              <p>Preview</p>
              <video ref={recording.previewRef} autoPlay loop playsInline />
              <div className="space-x-2 my-2">
                <div className="text-black">
                  <span>Dub from </span>
                  <select
                    value={selectedSourceId}
                    onChange={(e) => {
                      setSelectedSourceId(e.target.value);
                    }}
                  >
                    {source.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.language}
                      </option>
                    ))}
                  </select>
                  <span> to </span>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => {
                      setSelectedTargetId(e.target.value);
                    }}
                  >
                    {target.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.language}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={async () => {
                    console.log(selectedSourceId, selectedTargetId, email);

                    // check if everything is selected and the email is valid
                    // if (!selectedSourceId || !selectedTargetId || !email) {
                    //   return;
                    // }

                    // if everything is good, then upload the blob

                    setLoading(true);

                    // -------------------------------------------

                    // // Upload the blob to a back-end
                    // const formData = new FormData();
                    // formData.append(
                    //   "original_video",
                    //   finalRecording.blob as Blob,
                    //   `${email}.webm`,
                    // );
                    // formData.append("user", user?.id);
                    //
                    // let res = await pb.collection("dubbing").create(formData);
                    //
                    // console.log(res);
                    //
                    // // generate a file token
                    // const fileToken = await pb.files.getToken();
                    //
                    // console.log(
                    //   pb.getFileUrl(res, res["original_video"], {
                    //     token: fileToken,
                    //   }),
                    // );
                    //
                    // const records = await pb.collection("dubbing").getFullList({
                    //   sort: "-created",
                    //   expand: "user",
                    // });
                    //
                    // console.log(records);

                    // -------------------------------------------

                    // formData.append("source", selectedSourceId);
                    // formData.append("target", selectedTargetId);
                    // formData.append("email", email);
                    //
                    // const response = await fetch(
                    //   "https://camb.gauravgosain.dev/upload",
                    //   {
                    //     method: "POST",
                    //     body: formData,
                    //   },
                    // );
                    //
                    // const respText = await response.text();
                    //
                    // const temp = await fetch("/api/convert", {
                    //   method: "POST",
                    //   body: JSON.stringify({
                    //     email: email,
                    //     source: selectedSourceId,
                    //     target: selectedTargetId,
                    //   }) as any,
                    // });
                    //
                    // const tempJson = await temp.json();
                    //
                    // console.log(tempJson);
                    //
                    // const task_id = tempJson.task_id;
                    //
                    // let res;
                    //
                    // // write a polling loop
                    // while (true) {
                    //   const resp = await fetch(`/api/status`, {
                    //     method: "POST",
                    //     body: JSON.stringify({
                    //       task_id: task_id,
                    //     }) as any,
                    //   });
                    //   const respJson = await resp.json();
                    //   if (respJson.status === "SUCCESS") {
                    //     res = respJson;
                    //     break;
                    //   }
                    //   await new Promise((resolve) => setTimeout(resolve, 1000));
                    //   console.log(respJson);
                    // }
                    //
                    // const resp = await fetch(`/api/final_url`, {
                    //   method: "POST",
                    //   body: JSON.stringify({
                    //     run_id: res.run_id,
                    //   }) as any,
                    // });
                    // const respJson = await resp.json();
                    //
                    // console.log(respJson);
                    // const finalresp = await fetch(`/api/send_email`, {
                    //   method: "POST",
                    //   body: JSON.stringify({
                    //     email: email,
                    //     data: JSON.stringify(respJson),
                    //   }) as any,
                    // });
                    setLoading(false);
                  }}
                >
                  Dub from x to y
                </Button>
                <Button
                  onClick={() => {
                    clearPreview(recording.id);
                    clearAllRecordings();
                    setFinalRecording(null);
                  }}
                >
                  Clear preview
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webcam;
