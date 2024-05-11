import React, { useEffect } from "react";
import { useRecordWebcam } from "react-record-webcam";
import { Button } from "./button";
import { Select } from "./select";

const Webcam = () => {
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
    download,
    errorMessage,
    muteRecording,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam();

  const [videoDeviceId, setVideoDeviceId] = React.useState<string>("");
  const [audioDeviceId, setAudioDeviceId] = React.useState<string>("");
  const [finalRecording, setFinalRecording] = React.useState<any>(null);
  const [email, setEmail] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  interface Languages {
    id: number;
    language: string;
    short_name: string;
  }

  const [source, setSource] = React.useState<Languages[]>([]);
  const [target, setTarget] = React.useState<Languages[]>([]);

  const [selectedSourceId, setSelectedSourceId] = React.useState<string>("");
  const [selectedTargetId, setSelectedTargetId] = React.useState<string>("");

  useEffect(() => {
    fetch("/api/source").then(async (res) => {
      const json = await res.json();
      setSource(json);
    });

    fetch("/api/target").then(async (res) => {
      const json = await res.json();
      setTarget(json);
    });
  }, []);

  const handleSelect = async (event: any) => {
    const { deviceid: deviceId } =
      event.target.options[event.target.selectedIndex].dataset;
    if (devicesById?.[deviceId].type === "videoinput") {
      setVideoDeviceId(deviceId);
    }
    if (devicesById?.[deviceId].type === "audioinput") {
      setAudioDeviceId(deviceId);
    }
  };

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

  return (
    <div className="container mx-auto p-4 text-white">
      {/* make a full screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 top-0 left-0 right-0 bottom-0">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold">React Record Webcam demo</h1>
      <input
        type="email"
        placeholder="Enter email here"
        className="text-xl rounded-xl text-black p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <div className="space-y-2 my-4">
        <div className="flex">
          <h4>Select video input</h4>
          <Select
            items={devicesByType?.video || []}
            dataset="deviceid"
            onChange={handleSelect}
          />
        </div>
        <div className="flex">
          <h4>Select audio input</h4>
          <Select
            items={devicesByType?.audio || []}
            dataset="deviceid"
            onChange={handleSelect}
          />
        </div>
      </div>
      <div className="space-x-2">
        <Button onClick={quickDemo}>Record 30s video</Button>
        <Button onClick={start}>Open camera</Button>
        <Button onClick={() => clearAllRecordings()}>Clear all</Button>
        <Button onClick={() => clearError()}>Clear error</Button>
      </div>
      <div className="my-2">
        <p>{errorMessage ? `Error: ${errorMessage}` : ""}</p>
      </div>
      <div className="grid grid-cols-custom gap-4 my-4">
        {activeRecordings?.map((recording) => (
          <div className="bg-white rounded-lg px-4 py-4" key={recording.id}>
            <div className="text-black grid grid-cols-1">
              <p>Live</p>
              <small>Status: {recording.status}</small>
              <small>Video: {recording.videoLabel}</small>
              <small>Audio: {recording.audioLabel}</small>
            </div>
            <video ref={recording.webcamRef} loop autoPlay playsInline muted />
            <div className="space-x-1 space-y-1 my-2">
              <Button
                inverted
                disabled={
                  recording.status === "RECORDING" ||
                  recording.status === "PAUSED"
                }
                onClick={() => startRecording(recording.id)}
              >
                Record
              </Button>
              <Button
                inverted
                disabled={
                  recording.status !== "RECORDING" &&
                  recording.status !== "PAUSED"
                }
                toggled={recording.status === "PAUSED"}
                onClick={() =>
                  recording.status === "PAUSED"
                    ? resumeRecording(recording.id)
                    : pauseRecording(recording.id)
                }
              >
                {recording.status === "PAUSED" ? "Resume" : "Pause"}
              </Button>
              <Button
                inverted
                toggled={recording.isMuted}
                onClick={() => muteRecording(recording.id)}
              >
                Mute
              </Button>
              <Button
                inverted
                onClick={async () => {
                  const res = await stopRecording(recording.id);
                  setFinalRecording(res);
                  console.log(res);
                }}
              >
                Stop
              </Button>
              <Button inverted onClick={() => cancelRecording(recording.id)}>
                Cancel
              </Button>
            </div>

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
                  inverted
                  onClick={async () => {
                    console.log(selectedSourceId, selectedTargetId, email);

                    // check if everything is selected and the email is valid
                    if (!selectedSourceId || !selectedTargetId || !email) {
                      return;
                    }

                    // if everything is good, then upload the blob

                    setLoading(true);
                    // Upload the blob to a back-end
                    const formData = new FormData();
                    formData.append(
                      "file",
                      finalRecording.blob as Blob,
                      `${email}.webm`
                    );

                    formData.append("source", selectedSourceId);
                    formData.append("target", selectedTargetId);
                    formData.append("email", email);

                    const response = await fetch(
                      "https://camb.gauravgosain.dev/upload",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    const respText = await response.text();

                    const temp = await fetch("/api/convert", {
                      method: "POST",
                      body: JSON.stringify({
                        email: email,
                        source: selectedSourceId,
                        target: selectedTargetId,
                      }) as any,
                    });

                    const tempJson = await temp.json();

                    console.log(tempJson);

                    const task_id = tempJson.task_id;

                    let res;

                    // write a polling loop
                    while (true) {
                      const resp = await fetch(`/api/status`, {
                        method: "POST",
                        body: JSON.stringify({
                          task_id: task_id,
                        }) as any,
                      });
                      const respJson = await resp.json();
                      if (respJson.status === "SUCCESS") {
                        res = respJson;
                        break;
                      }
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      console.log(respJson);
                    }

                    const resp = await fetch(`/api/final_url`, {
                      method: "POST",
                      body: JSON.stringify({
                        run_id: res.run_id,
                      }) as any,
                    });
                    const respJson = await resp.json();

                    console.log(respJson);
                    const finalresp = await fetch(`/api/send_email`, {
                      method: "POST",
                      body: JSON.stringify({
                        email: email,
                        data: JSON.stringify(respJson),
                      }) as any,
                    });
                    setLoading(false);
                  }}
                >
                  Dub from x to y
                </Button>
                <Button inverted onClick={() => clearPreview(recording.id)}>
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
