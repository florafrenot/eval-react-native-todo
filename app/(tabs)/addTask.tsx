import ButtonApp from "@/components/Button";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function TabAddTask() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [text, setText] = useState('');

    // const handleAddTask = () => {
    //     if (text.trim().length === 0) return;
    //     router.push(`/todolist?newTaskText=${encodeURIComponent(text)}`);
    //     setText('');
    // };

    const handleAddTask = async () => {
        if (text.trim().length === 0) return;

        // je sauvegarde le texte avec AsyncStorage
        await AsyncStorage.setItem('text', text);

        // je navigue vers la TodoList
        router.push(`/todolist?newTaskText=${encodeURIComponent(text)}`);

        setText('');
    };

    useEffect(() => {
        const loadText = async () => {
            const value = await AsyncStorage.getItem('text');
            if (value !== null) {
                setText(value);
            }
        };

        loadText();
    }, []);


    return (
        <View style={{
            marginTop: insets.top,
            marginBottom: insets.bottom,
            marginLeft: insets.left,
            marginRight: insets.right,
            padding: 20,
        }}>
            <Text style={styles.title}>Ajouter une nouvelle tâche</Text>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Quelle est ta tâche aujourd'hui..."
            />
            <ButtonApp 
                title="Ajouter" 
                onPress={handleAddTask} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 8,
        marginVertical: 10,
        width: '100%',
    },
});