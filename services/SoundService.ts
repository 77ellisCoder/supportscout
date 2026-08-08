import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const clickSource = require("../assets/sounds/ui-click.mp3");

class SoundServiceClass {
    private clickPlayer = createAudioPlayer(clickSource);
    private initialised = false;

    async initialise(): Promise<void> {
        if (this.initialised) {
            return;
        }

        await setAudioModeAsync({
            interruptionMode: "mixWithOthers",
            playsInSilentMode: true,
        });

        this.clickPlayer.volume = 0.35;
        this.initialised = true;
    }

    click(): void {
        try {
            this.clickPlayer.seekTo(0);
            this.clickPlayer.play();
        } catch (error) {
            console.warn("Unable to play click sound:", error);
        }
    }

    unload(): void {
        try {
            this.clickPlayer.remove();
        } catch (error) {
            console.warn("Unable to unload UI sounds:", error);
        }
    }
}

export const SoundService = new SoundServiceClass();