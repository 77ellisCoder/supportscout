import { View } from "react-native";

import { Button } from "./Button";
import { styles } from "./FormActions.styles";

type FormActionsProps = {
    submitLabel: string;
    saving?: boolean;
    onSubmit: () => void | Promise<void>;
};

export function FormActions({
    submitLabel,
    saving = false,
    onSubmit,
}: FormActionsProps) {
    return (
        <View style={styles.container}>
            <Button
                title={submitLabel}
                loading={saving}
                onPress={onSubmit}
            />
        </View>
    );
}