import ButtonApp from "@/components/Button";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '@/models/Task'
export default function TabTodoList() {

    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { newTaskText } = useLocalSearchParams();

    const [tasks, setTasks] = useState([]);
    // const [tasks, setTasks] = useState<Task>();

    // const [taskText, setTaskText] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editText, setEditText] = useState('');

    // je charge les tâches grâce AsyncStorage
    useEffect(() => {
        const loadTasks = async () => {
            const savedTasks = await AsyncStorage.getItem('tasks');
            if (savedTasks !== null) {
                setTasks(JSON.parse(savedTasks));
            }
        };

        loadTasks();
    }, []);

    // j'ajoute une nouvelle mission
    useEffect(() => {
        if (newTaskText && typeof newTaskText === 'string') {
            const newTask = { id: Date.now(), text: newTaskText };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
        }
    }, [newTaskText]);

    // pour sauvegarder les tâches
    const saveTasks = async (updatedTasks) => {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    // pour éditer une tâche
    const editerTache = (task) => {
        setEditTaskId(task.id);
        setEditText(task.text);
    };

    // pour sauvegarder l'édition d'une tâche
    const sauvegarder = () => {
        if (editText.trim().length === 0) return;
        const updatedTasks = tasks.map(task => {
            if (task.id === editTaskId) {
                return { ...task, text: editText };
            }
            return task;
        });
        setTasks(updatedTasks);
        setEditTaskId(null);
        setEditText('');
        saveTasks(updatedTasks);
    };

    // Supprimer une tâche
    const supprimerTache = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };
    
    // j'ajoute la tâche dans le composant
    const pageAjoutTache = () => {
        router.push('/addTask');
    };
    return (
        <View style={{ 
            marginTop: insets.top, 
            marginBottom: insets.bottom, 
            marginLeft: insets.left, 
            marginRight: insets.right 
        }}>
            <Text style={styles.title}>Ma Todo List !</Text>
            {/* pour ajouter une tâche */}
            <ButtonApp title="Ajouter une tâche" onPress={pageAjoutTache}></ButtonApp>
            {/* Liste des tâches */}
            <FlatList
                data={tasks}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        {editTaskId === item.id ? (
                            <View style={styles.editContainer}>
                                <TextInput
                                    value={editText}
                                    onChangeText={setEditText}
                                    style={styles.input}
                                />
                                <Button title="Sauvegarder" onPress={sauvegarder}/>
                                {/* <ButtonApp title="Sauvegarder" onPress={sauvegarder} /> */}
                            </View>
                        ) : (
                            <View style={styles.taskContent}>
                                <Text style={styles.taskText}>{item.text}</Text>
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity onPress={() => editerTache(item)} style={styles.editButton}>
                                        {/* <Text style={styles.buttonText}>Editer</Text> */}
                                        <TabBarIcon name={'pencil-outline'} color='white' />

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => supprimerTache(item.id)} style={styles.deleteButton}>
                                        {/* <Text style={styles.buttonText}>Supprimer</Text> */}
                                        <TabBarIcon name={'trash-outline'} color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
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
    list: {
        marginTop: 20,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 8,
        marginVertical: 10,
        width: '60%',
    },
    taskItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    taskContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskText: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: 'grey',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        padding: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});