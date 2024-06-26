import React, { Fragment, useEffect } from "react";
import { useRecordWebcam } from "react-record-webcam";
import { SelectCustom } from "./select";
import pb from "@/lib/pocketbase";
import { AuthModel, ClientResponseError } from "pocketbase";
import { Button } from "./ui/button";
import { useLoadingStore } from "@/lib/stores/loading-store";
import {
  CircleStop,
  MicIcon,
  MicOffIcon,
  Pause,
  Play,
  Video,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Languages } from "@/lib/shared-types";
import { LanguageSelect } from "./language-select";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Webcam = ({ user, demo = false }: { user: AuthModel; demo: boolean }) => {
  const {
    activeRecordings,
    clearAllRecordings,
    clearPreview,
    closeCamera,
    createRecording,
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

  const [videoDeviceId, setVideoDeviceId] = React.useState<string | null>(null);
  const [audioDeviceId, setAudioDeviceId] = React.useState<string | null>(null);
  const [finalRecording, setFinalRecording] = React.useState<any>(null);

  const { setLoading } = useLoadingStore();

  const router = useRouter();

  const [source, setSource] = React.useState<Languages[]>([]);
  const [target, setTarget] = React.useState<Languages[]>([]);

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");

  const [selectedSourceId, setSelectedSourceId] =
    React.useState<Languages | null>(null);
  const [selectedTargetId, setSelectedTargetId] =
    React.useState<Languages | null>(null);

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

  useEffect(() => {
    if (errorMessage === null) return;
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: errorMessage,
    });
  }, [errorMessage]);

  useEffect(() => {
    setVideoDeviceId(devicesByType?.video[0].deviceId ?? null);
    setAudioDeviceId(devicesByType?.audio[0].deviceId ?? null);
  }, [devicesByType]);

  const start = async () => {
    if (videoDeviceId === null || audioDeviceId === null) return;
    setLoading(true);
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
    setLoading(false);
  };

  const stop = (recordingID: string) => {
    clearPreview(recordingID);
    closeCamera(recordingID);
    clearAllRecordings();
    setFinalRecording(null);
    setVideoDeviceId(null);
    setAudioDeviceId(null);
  };

  useEffect(() => {
    if (audioDeviceId && videoDeviceId) start();
    return () => {
      clearAllRecordings();
    };
  }, [videoDeviceId, audioDeviceId]);

  const startDubbing = async () => {
    setLoading(true);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // -------------------------------------------

    // Upload the blob to a back-end
    const formData = new FormData();
    formData.append(
      "original_video",
      finalRecording.blob as Blob,
      isSafari ? "original_video.mp4" : "original_video.webm",
    );
    formData.append("user", user?.id);
    if (demo) {
      formData.append("name", name);
      formData.append("email", email);
    } else {
      formData.append("name", user?.name);
      formData.append("email", user?.email);
    }
    formData.append("source_id", `${selectedSourceId?.id}`);
    formData.append("target_id", `${selectedTargetId?.id}`);
    formData.append("status", "STARTED");

    try {
      let res = await pb.collection("dubbing").create(formData);
      setLoading(false);
      router.push(`/dubbing/${res.id}`);
    } catch (err) {
      // video limit is 40242880 bytes so might hit errors here
      const customErr = err as ClientResponseError;
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: customErr.data.data.original_video.message,
      });

      setLoading(false);
    }
  };

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

      <div className="grid grid-cols-custom gap-4 my-4">
        {activeRecordings?.map((recording) => (
          <div className="rounded-lg px-4 py-4" key={recording.id}>
            {!finalRecording && (
              <div className="relative">
                <video
                  ref={recording.webcamRef}
                  className="rounded-xl"
                  loop
                  autoPlay
                  playsInline
                  muted
                />

                {recording.status === "RECORDING" && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 justify-center">
                    <div className="h-5 w-5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-md font-medium">Recording</span>
                  </div>
                )}
                {recording.status === "PAUSED" && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 justify-center">
                    <div className="h-5 w-5 bg-red-500" />
                    <span className="text-md font-medium">Paused</span>
                  </div>
                )}
                <div className="absolute z-50 top-4 left-4 flex items-center gap-2 justify-center">
                  <Button
                    variant={"secondary"}
                    onClick={() => stop(recording.id)}
                  >
                    Change devices
                  </Button>
                </div>
                <div className="absolute cursor-pointer bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 justify-center ">
                  {recording.status === "RECORDING" ||
                  recording.status === "PAUSED" ? (
                    <Fragment>
                      <div
                        className="p-4 bg-primary-foreground rounded-full"
                        onClick={() =>
                          recording.status === "PAUSED"
                            ? resumeRecording(recording.id)
                            : pauseRecording(recording.id)
                        }
                      >
                        {recording.status === "PAUSED" ? (
                          <Play className="w-8 h-8" />
                        ) : (
                          <Pause className="w-8 h-8" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-4 bg-primary-foreground rounded-full",
                          recording.isMuted && "bg-red-600",
                        )}
                        onClick={() => muteRecording(recording.id)}
                      >
                        {recording.isMuted ? (
                          <MicOffIcon className="w-8 h-8" />
                        ) : (
                          <MicIcon className="w-8 h-8" />
                        )}
                      </div>

                      <div
                        className="p-4 bg-red-400 rounded-full"
                        onClick={async () => {
                          const res = await stopRecording(recording.id);
                          console.log(res);
                          setFinalRecording(res);
                          closeCamera(recording.id);
                        }}
                      >
                        <CircleStop className="w-8 h-8" />
                      </div>
                    </Fragment>
                  ) : (
                    <div
                      className="p-4 bg-red-400 rounded-full"
                      onClick={() => startRecording(recording.id)}
                    >
                      <Video className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={`${
                recording.previewRef.current?.src.startsWith("blob:")
                  ? "visible"
                  : "hidden"
              } relative`}
            >
              <div
                className="absolute top-4 left-4 flex \
                items-center gap-2 justify-center p-4 rounded-xl \
                bg-slate-900/80 text-white font-bold text-2xl"
              >
                Preview
              </div>
              <video ref={recording.previewRef} autoPlay loop playsInline />
              <div className="absolute cursor-pointer top-4 right-4 flex items-center gap-2 justify-center ">
                <div
                  className="p-4 bg-primary-foreground rounded-full text-primary"
                  onClick={() => stop(recording.id)}
                >
                  <XIcon className="w-8 h-8" />
                </div>
              </div>
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col  \
                items-center gap-2 justify-center p-4 rounded-xl \
                bg-slate-900/80 w-3/4"
              >
                <div className="space-x-2 my-2 flex flex-col justify-center items-center md:flex-row">
                  <div className="text-white">Dub from </div>
                  <LanguageSelect
                    languages={source}
                    selectedLanguage={selectedSourceId}
                    setSelectedLanguage={setSelectedSourceId}
                    placeholder={"Source language"}
                  />
                  <div className="text-white"> to </div>
                  <LanguageSelect
                    languages={target}
                    selectedLanguage={selectedTargetId}
                    setSelectedLanguage={setSelectedTargetId}
                    placeholder={"Target language"}
                  />
                </div>
                {selectedSourceId && selectedTargetId && !demo && (
                  <Button onClick={startDubbing}>Start dubbing</Button>
                )}
                {selectedSourceId && selectedTargetId && demo && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Continue</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Hi there 👋</DialogTitle>
                        <DialogDescription>
                          Please enter your details here. Click start dubbing
                          when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={name}
                            type={"text"}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            value={email}
                            type={"email"}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!name || !email) {
                              toast({
                                variant: "destructive",
                                title: "Uh oh! Something went wrong.",
                                description: "Please enter a name and email!",
                              });
                              return;
                            }
                            startDubbing();
                          }}
                        >
                          Start dubbing
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webcam;
