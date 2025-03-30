import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert
} from "react-native";

const initialTrips = [
  { id: "1", title: "Париж", date: "01.02.2024", image: "https://via.placeholder.com/100", description: "Романтична подорож до столиці Франції" },
  { id: "2", title: "Рим", date: "15.03.2024", image: "https://via.placeholder.com/100", description: "Екскурсії античними пам'ятками" },
  { id: "3", title: "Лондон", date: "10.04.2024", image: "https://via.placeholder.com/100", description: "Прогулянки Темзою та відвідини музеїв" },
];

const TripItem = ({ title, date, image, onPress, onLongPress, isDarkTheme }) => (
  <TouchableOpacity 
    onPress={onPress} 
    onLongPress={onLongPress} 
    style={[styles.tripItem, isDarkTheme && styles.darkTripItem]}
  >
    <Image source={{ uri: image }} style={styles.image} />
    <View>
      <Text style={[styles.tripTitle, isDarkTheme && styles.darkText]}>{title}</Text>
      <Text style={[styles.tripDate, isDarkTheme && styles.darkSecondaryText]}>{date}</Text>
    </View>
  </TouchableOpacity>
);

const ScreenSelector = ({ screen, setScreen, isDarkTheme }) => (
  <View style={[styles.screenSelector, isDarkTheme && styles.darkScreenSelector]}>
    <TouchableOpacity 
      style={[
        styles.selectorButton, 
        screen === 'trips' && [styles.activeButton, isDarkTheme && styles.darkActiveButton]
      ]}
      onPress={() => setScreen('trips')}
    >
      <Text style={[styles.selectorButtonText, isDarkTheme && styles.darkText]}>Подорожі</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={[
        styles.selectorButton, 
        screen === 'settings' && [styles.activeButton, isDarkTheme && styles.darkActiveButton]
      ]}
      onPress={() => setScreen('settings')}
    >
      <Text style={[styles.selectorButtonText, isDarkTheme && styles.darkText]}>Налаштування</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={[
        styles.selectorButton, 
        screen === 'addTrip' && [styles.activeButton, isDarkTheme && styles.darkActiveButton]
      ]}
      onPress={() => setScreen('addTrip')}
    >
      <Text style={[styles.selectorButtonText, isDarkTheme && styles.darkText]}>Додати</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [screen, setScreen] = useState("trips");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [tripsList, setTripsList] = useState(initialTrips);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: "",
    date: "",
    image: "https://via.placeholder.com/100",
    description: ""
  });
  const [filterDate, setFilterDate] = useState("");

  const handleAddTrip = () => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    
    if (!newTrip.title || !newTrip.date) {
      Alert.alert("Помилка", "Будь ласка, заповніть назву та дату подорожі");
      return;
    }
    
    if (!dateRegex.test(newTrip.date)) {
      Alert.alert("Помилка", "Невірний формат дати. Використовуйте дд.мм.рррр");
      return;
    }

    const newTripWithId = {
      ...newTrip,
      id: Date.now().toString()
    };

    setTripsList([...tripsList, newTripWithId]);
    setNewTrip({ title: "", date: "", image: "https://via.placeholder.com/100", description: "" });
    setScreen("trips");
  };

  const handleDeleteTrip = (id) => {
    Alert.alert(
      "Видалити подорож",
      "Ви впевнені, що хочете видалити цю подорож?",
      [
        { text: "Скасувати", style: "cancel" },
        { text: "Видалити", onPress: () => {
          setTripsList(tripsList.filter((trip) => trip.id !== id));
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <ScreenSelector screen={screen} setScreen={setScreen} isDarkTheme={isDarkTheme} />

      {screen === "trips" ? (
        <FlatList
          data={tripsList.filter((trip) => trip.date.includes(filterDate))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TripItem
              title={item.title}
              date={item.date}
              image={item.image}
              onPress={() => {
                setSelectedTrip(item);
                setModalVisible(true);
              }}
              onLongPress={() => handleDeleteTrip(item.id)}
              isDarkTheme={isDarkTheme}
            />
          )}
        />
      ) : screen === "settings" ? (
        <View style={styles.settings}>
          <Text style={[styles.settingsTitle, isDarkTheme && styles.darkText]}>Налаштування</Text>

          <View style={styles.settingItem}>
            <Text style={isDarkTheme && styles.darkText}>Темна тема</Text>
            <Button 
              title={isDarkTheme ? "Вимкнути" : "Увімкнути"} 
              onPress={() => setIsDarkTheme(!isDarkTheme)} 
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={isDarkTheme && styles.darkText}>Фільтрувати за датою</Text>
            <TextInput
              style={[styles.input, isDarkTheme && styles.darkInput]}
              placeholder="Введіть дату (дд.мм.рррр)"
              value={filterDate}
              onChangeText={setFilterDate}
              placeholderTextColor={isDarkTheme ? "#aaa" : "#888"}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={isDarkTheme && styles.darkText}>Кількість подорожей: {tripsList.length}</Text>
          </View>

          <View style={styles.settingItem}>
            <Button
              title="Скинути всі подорожі"
              color={isDarkTheme ? "#ff4444" : "red"}
              onPress={() => {
                Alert.alert(
                  "Скинути все",
                  "Ви впевнені, що хочете видалити всі подорожі?",
                  [
                    { text: "Скасувати", style: "cancel" },
                    { text: "Скинути", onPress: () => setTripsList([]) }
                  ]
                );
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.addTripContainer}>
          <Text style={[styles.addTripTitle, isDarkTheme && styles.darkText]}>Додати нову подорож</Text>

          <TextInput
            style={[styles.input, isDarkTheme && styles.darkInput]}
            placeholder="Назва подорожі"
            value={newTrip.title}
            onChangeText={(text) => setNewTrip({ ...newTrip, title: text })}
            placeholderTextColor={isDarkTheme ? "#aaa" : "#888"}
          />

          <TextInput
            style={[styles.input, isDarkTheme && styles.darkInput]}
            placeholder="Дата (дд.мм.рррр)"
            value={newTrip.date}
            onChangeText={(text) => setNewTrip({ ...newTrip, date: text })}
            placeholderTextColor={isDarkTheme ? "#aaa" : "#888"}
          />

          <TextInput
            style={[styles.input, isDarkTheme && styles.darkInput]}
            placeholder="Опис подорожі"
            value={newTrip.description}
            onChangeText={(text) => setNewTrip({ ...newTrip, description: text })}
            placeholderTextColor={isDarkTheme ? "#aaa" : "#888"}
            multiline
          />

          <Button 
            title="Додати подорож" 
            onPress={handleAddTrip} 
            color={isDarkTheme ? "#0066cc" : "#007AFF"}
          />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, isDarkTheme && styles.darkContainer]}>
          {selectedTrip && (
            <>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isDarkTheme && styles.darkText]}>{selectedTrip.title}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={[styles.closeButton, isDarkTheme && styles.darkText]}>×</Text>
                </TouchableOpacity>
              </View>

              <Image source={{ uri: selectedTrip.image }} style={styles.modalImage} />

              <View style={styles.modalDetails}>
                <Text style={[styles.modalDetail, isDarkTheme && styles.darkText]}>
                  <Text style={[styles.detailLabel, isDarkTheme && styles.darkText]}>Дата: </Text>
                  {selectedTrip.date}
                </Text>

                <Text style={[styles.modalDetail, isDarkTheme && styles.darkText]}>
                  <Text style={[styles.detailLabel, isDarkTheme && styles.darkText]}>Опис: </Text>
                  {selectedTrip.description}
                </Text>
              </View>

              <Button 
                title="Закрити" 
                onPress={() => setModalVisible(false)} 
                color={isDarkTheme ? "#0066cc" : "#007AFF"}
              />
            </>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  screenSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 5,
  },
  darkScreenSelector: {
    backgroundColor: "#333",
  },
  selectorButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectorButtonText: {
    color: "#000",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  darkActiveButton: {
    backgroundColor: "#0066cc",
  },
  tripItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  darkTripItem: {
    backgroundColor: '#333',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#000',
  },
  tripDate: {
    fontSize: 14,
    color: '#555',
  },
  darkText: {
    color: '#fff',
  },
  darkSecondaryText: {
    color: '#aaa',
  },
  settings: {
    flex: 1,
    padding: 10,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000',
  },
  settingItem: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  darkInput: {
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#fff',
  },
  addTripContainer: {
    flex: 1,
    padding: 10,
  },
  addTripTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#000',
  },
  closeButton: {
    fontSize: 30,
    color: '#000',
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalDetails: {
    marginBottom: 20,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  detailLabel: {
    fontWeight: "bold",
  },
});