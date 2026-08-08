import { Audio, AVPlaybackStatus } from "expo-av";

class SoundServiceClass {
    private clickSound: Audio.Sound | null = null;
    private isLoaded = false;
    private isLoading = false;

    async initialise(): Promise<void> {
        if (this.isLoaded || this.isLoading) {
            return;
        }

        this.isLoading = true;

        try {
            const { sound } = await Audio.Sound.createAsync(
                require("../assets/sounds/ui-click.mp3"),
                {
                    shouldPlay: false,
                    volume: 0.35,
                }
            );

            this.clickSound = sound;
            this.isLoaded = true;
        } catch (error) {
            console.warn("Unable to preload UI sounds:", error);
        } finally {
            this.isLoading = false;
        }
    }

    async click(): Promise<void> {
        if (!this.clickSound) {
            await this.initialise();
        }

        if (!this.clickSound) {
            return;
        }

        try {
            await this.clickSound.setPositionAsync(0);
            await this.clickSound.playAsync();
        } catch (error) {
            console.warn("Unable to play click sound:", error);
        }
    }

    async unload(): Promise<void> {
        if (!this.clickSound) {
            return;
        }

        try {
            await this.clickSound.unloadAsync();
        } catch (error) {
            console.warn("Unable to unload UI sounds:", error);
        } finally {
            this.clickSound = null;
            this.isLoaded = false;
        }
    }
}

export const SoundService = new SoundServiceClass();