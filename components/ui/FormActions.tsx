import { View } from "react-native";

import { Button } from "./Button";
import { styles } from "./FormActions.styles";

type FormActionsProps = {
    submitLabel: string;
    saving?: boolean;
    onSubmit: () => void | Promise<void>;
    inActionBar?: boolean;
};

export function FormActions({
    submitLabel,
    saving = false,
    onSubmit,
    inActionBar = false,
}: FormActionsProps) {
    return (
        <View
            style={[
                styles.container,
                inActionBar &&
                    styles.containerActionBar,
            ]}
        >
            <Button
                title={submitLabel}
                loading={saving}
                onPress={onSubmit}
            />
        </View>
    );
}