import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
];

export default function TranslateScreen({ navigation }) {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [history, setHistory] = useState([]);

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    const supportedCodes = ['en', 'es', 'fr', 'de', 'ru', 'ar', 'tr', 'zh', 'ja'];
    const source = supportedCodes.includes(sourceLang) ? sourceLang : 'en';
    const target = supportedCodes.includes(targetLang) ? targetLang : 'en';

    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://192.168.0.108:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          q: inputText,
          source,
          target,
          format: 'text',
        }),
      });

      const data = await res.json();

      if (!data.translatedText) {
        throw new Error('No translation returned');
      }

      const translated = data.translatedText;
      setTranslatedText(translated);
      setHistory((prev) => [...prev, { from: inputText, to: translated }]);
    } catch (err) {
      console.log('Translation Error:', err);
      setError('Could not translate. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const speak = (text, lang) => {
    Speech.speak(text, { language: lang });
  };

  const renderLanguageOption = (onSelect) => ({ item }) => (
    <TouchableOpacity
      style={styles.langOption}
      onPress={() => {
        onSelect(item.code);
        setShowSourceModal(false);
        setShowTargetModal(false);
      }}
    >
      <Text style={styles.langOptionText}>{item.flag} {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerText}>Translate App</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.langSwitchRow}>
          <TouchableOpacity style={styles.langBtn} onPress={() => setShowSourceModal(true)}>
            <Text>{languages.find((l) => l.code === sourceLang)?.flag} {languages.find((l) => l.code === sourceLang)?.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={swapLanguages}>
            <Ionicons name="swap-horizontal" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.langBtn} onPress={() => setShowTargetModal(true)}>
            <Text>{languages.find((l) => l.code === targetLang)?.flag} {languages.find((l) => l.code === targetLang)?.name}</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        {loading && <ActivityIndicator size="large" color="#5f77f2" style={{ marginVertical: 10 }} />}
        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        {translatedText !== '' && (
          <View style={styles.translationBox}>
            <Text style={styles.translationText}>{translatedText}</Text>
            <TouchableOpacity onPress={() => speak(translatedText, targetLang)}>
              <Ionicons name="volume-high-outline" size={24} color="#5f77f2" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={handleTranslate}>
          <Text style={styles.translateText}>Translate</Text>
        </TouchableOpacity>

        {history.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>History:</Text>
            {history.map((item, i) => (
              <Text key={i} style={{ marginBottom: 5 }}>
                {item.from} → {item.to}
              </Text>
            ))}
          </View>
        )}
      </View>

      <Modal visible={showSourceModal || showTargetModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageOption(showSourceModal ? setSourceLang : setTargetLang)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  header: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5f77f2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  body: { paddingHorizontal: 30, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  translationBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  translationText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  langSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  langBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  swapBtn: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  actionButton: {
    backgroundColor: '#5f77f2',
    padding: 15,
    borderRadius: 999,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  translateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
  },
  modalBox: {
    backgroundColor: 'white',
    margin: 30,
    padding: 20,
    borderRadius: 16,
    maxHeight: '70%',
  },
  langOption: {
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  langOptionText: {
    fontSize: 18,
  },
});
