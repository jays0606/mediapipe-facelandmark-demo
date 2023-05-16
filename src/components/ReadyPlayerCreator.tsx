import { AvatarCreator, EditorConfig } from "@readyplayerme/rpm-react-sdk";

const config: EditorConfig = {
  clearCache: true,
  bodyType: "halfbody",
  quickStart: false,
  language: "en",
};

interface ReadyPlayerCreatorProps {
  width: number;
  height: number;
  handleComplete: (url: string) => void;
}

const ReadyPlayerCreator = ({
  width,
  height,
  handleComplete,
}: ReadyPlayerCreatorProps) => {
  return (
    <div className="absolute" style={{ width: width, height: height, zIndex: 1 }}>
      <AvatarCreator
        subdomain="demo"
        editorConfig={config}
        onAvatarExported={handleComplete}
      />
    </div>
  );
};

export default ReadyPlayerCreator;
