import { Pressable, StyleSheet, Text, View } from "react-native";

declare type Props = {
    title: string;
    onPress: () => void
}

export default function ButtonApp({title, onPress}: Props)
{
    return <View style={styles.contentButton}>
            <Pressable
                        onPress={onPress}
                        style={styles.button}>
                        <Text style={styles.textButton}>
                            {title}
                        </Text>

            </Pressable>
    </View>
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        padding: 10,
        borderColor: 'black',
        backgroundColor: 'green',
        width: 150,
        borderRadius: 10
    },
    textButton: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
  },
  contentButton: {
    alignItems: 'center',
    marginBottom: 20
  }
})