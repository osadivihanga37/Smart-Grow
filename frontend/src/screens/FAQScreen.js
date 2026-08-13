import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { matchFAQ } from '../utils/faqMatcher'
import { t } from '../../translations'
import { useLanguage } from '../context/LanguageContext'
import { useNavigation } from '@react-navigation/native'
import { COLORS, RADIUS, SPACING, SHADOW, TYPOGRAPHY } from '../theme'

export default function FAQScreen() {
  const navigation = useNavigation()
  const { lang } = useLanguage()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { from: 'bot', text: t('faq_greeting', lang) || 'Ask me anything about Smart Grow!' },
  ])
  const scrollRef = useRef(null)

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    const { answer } = matchFAQ(input, lang)
    const botMsg = { from: 'bot', text: answer }
    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>{t('faqTitle', lang) || 'Smart Grow Assistant'}</Text>
          <Text style={styles.headerSubtitle}>Always here to help</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Chat area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={{ paddingVertical: SPACING.md }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m, i) => (
            <View
              key={i}
              style={[styles.messageRow, m.from === 'user' ? styles.messageRowUser : styles.messageRowBot]}
            >
              {m.from === 'bot' && (
                <View style={styles.botAvatar}>
                  <Ionicons name="leaf" size={14} color="#fff" />
                </View>
              )}
              <View style={m.from === 'user' ? styles.userBubble : styles.botBubble}>
                <Text style={m.from === 'user' ? styles.userBubbleText : styles.botBubbleText}>
                  {m.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t('faq_placeholder', lang) || 'Type your question...'}
            placeholderTextColor={COLORS.textMuted}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.7}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOW.soft,
  },
  backButton: { padding: 4, marginRight: SPACING.sm },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerTitle: { ...TYPOGRAPHY.h3, fontSize: 16, color: COLORS.textDark },
  headerSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },

  chatArea: { flex: 1, paddingHorizontal: SPACING.md },

  messageRow: { flexDirection: 'row', marginBottom: SPACING.sm, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowBot: { justifyContent: 'flex-start' },

  botAvatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 6,
  },

  userBubble: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderBottomRightRadius: 4,
    maxWidth: '78%',
    ...SHADOW.soft,
  },
  botBubble: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderBottomLeftRadius: 4,
    maxWidth: '78%',
    ...SHADOW.soft,
  },
  userBubbleText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  botBubbleText: { color: COLORS.textDark, fontSize: 14, lineHeight: 20 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOW.soft,
  },
})