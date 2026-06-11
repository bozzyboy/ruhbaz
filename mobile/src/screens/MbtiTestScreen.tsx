import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { BrandedScrollView } from '../components/BrandedScrollView';
import { appendReplacingProfileTestResult, appendUserStatedTestResult } from '../services/profileMemoryService';
import { getPersonalityTests, type PersonalityTestDefinition, type PersonalityTestId } from '../data/personalityTests';
import {
  getMbtiQuestions,
  getMbtiStrings,
  getMbtiTypeArchetypes,
  getMbtiTypeDescriptions,
  getMbtiTypeDetail,
} from '../data/mbtiContent';
import { getAppLanguage } from '../i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'MbtiTest'>;

type GenericResult = {
  type: string;
  scores: Record<string, number>;
  percentages: Record<string, number>;
};

function buildTestSelection(t: TFunction): Array<{
  id: 'mbti' | PersonalityTestId;
  title: string;
  meta: string;
  description: string;
}> {
  return [
    {
      id: 'mbti',
      title: t('tests.mbtiTitle'),
      meta: t('tests.mbtiMeta'),
      description: t('tests.mbtiSelectDescription'),
    },
    ...Object.values(getPersonalityTests()).map((test) => ({
      id: test.id,
      title: test.title,
      meta: test.meta,
      description: test.intro,
    })),
  ];
}

function FivePointSlider({
  value,
  onChange,
}: {
  value?: number;
  onChange: (value: number) => void;
}) {
  const selectedValue = value;
  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderTrack} />
      {[1, 2, 3, 4, 5].map((point) => (
        <TouchableOpacity
          key={point}
          activeOpacity={0.8}
          style={[styles.sliderPointTouch, { left: `${((point - 1) / 4) * 100}%` }]}
          onPress={() => onChange(point)}
        >
          <View style={[styles.sliderPoint, selectedValue === point && styles.sliderPointSelected]} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function calculateResult(answers: Record<number, number>) {
  const q = (id: number) => answers[id] || 3;
  const scores = {
    IE: 30 - q(3) - q(7) - q(11) + q(15) - q(19) + q(23) + q(27) - q(31),
    SN: 12 + q(4) + q(8) + q(12) + q(16) + q(20) - q(24) - q(28) + q(32),
    FT: 30 - q(2) + q(6) + q(10) - q(14) - q(18) + q(22) - q(26) - q(30),
    JP: 18 + q(1) + q(5) - q(9) + q(13) - q(17) + q(21) - q(25) + q(29),
  };
  const type = [
    scores.IE > 24 ? 'E' : 'I',
    scores.SN > 24 ? 'N' : 'S',
    scores.FT > 24 ? 'T' : 'F',
    scores.JP > 24 ? 'P' : 'J',
  ].join('');
  return { type, scores };
}

function dimensionMeaning(type: string, t: TFunction) {
  const introExtro = type[0] === 'E' ? t('tests.dimExtraversion') : t('tests.dimIntroversion');
  const sensingIntuition = type[1] === 'N' ? t('tests.dimIntuition') : t('tests.dimSensing');
  const feelingThinking = type[2] === 'T' ? t('tests.dimThinking') : t('tests.dimFeeling');
  const judgingPerceiving = type[3] === 'P' ? t('tests.dimPerceiving') : t('tests.dimJudging');
  return [introExtro, sensingIntuition, feelingThinking, judgingPerceiving];
}

function calculateGenericResult(test: PersonalityTestDefinition, answers: Record<number, number>): GenericResult {
  const totals: Record<string, number> = {};
  const counts: Record<string, number> = {};
  test.questions.forEach((question) => {
    const raw = answers[question.id] || 3;
    const value = question.reverse ? 6 - raw : raw;
    totals[question.dimension] = (totals[question.dimension] || 0) + value;
    counts[question.dimension] = (counts[question.dimension] || 0) + 1;
  });
  const percentages = Object.fromEntries(
    Object.entries(totals).map(([key, total]) => [key, Math.round((total / ((counts[key] || 1) * 5)) * 100)]),
  );
  const type = test.resultOrder.reduce((best, key) => {
    if (!best) return key;
    return (percentages[key] || 0) > (percentages[best] || 0) ? key : best;
  }, '');
  return { type, scores: totals, percentages };
}

function GenericPersonalityTestScreen({
  navigation,
  profileId,
  test,
}: {
  navigation: Props['navigation'];
  profileId: string;
  test: PersonalityTestDefinition;
}) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [savedResultType, setSavedResultType] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const missingQuestionIds = test.questions.filter((question) => typeof answers[question.id] !== 'number').map((question) => question.id);
  const result = useMemo(() => calculateGenericResult(test, answers), [answers, test]);
  const resultDetail = test.results[result.type];

  const setAnswer = (questionId: number, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const saveAndShowResult = async () => {
    if (answeredCount < test.questions.length || isSaving || !resultDetail) return;
    const dimensionSummary = test.resultOrder
      .map((key) => `${test.dimensions[key]} ${result.percentages[key] || 0}%`)
      .join(', ');
    const summary = getMbtiStrings().buildGenericSummary({
      testTitle: test.title,
      resultTitle: resultDetail.title,
      description: resultDetail.description,
      dimensionSummary,
    });
    setIsSaving(true);
    try {
      if (savedResultType !== result.type) {
        const nextState = await appendReplacingProfileTestResult({
          profileId,
          assistantId: 'testler',
          readingType: 'personality-test',
          surfacesRead: [],
          summary,
          testResult: {
            testId: test.id,
            testName: test.title,
            resultCode: resultDetail.code,
            resultTitle: resultDetail.title,
            dimensions: result.percentages,
          },
          transcript: [
            {
              role: 'assistant',
              text: summary,
              timestamp: Date.now(),
            },
          ],
        });
        const readingId = nextState.readings[0]?.readingId;
        await appendUserStatedTestResult({
          profileId,
          readingId: readingId || `${Date.now()}`,
          testId: test.id,
          testName: test.title,
          resultCode: resultDetail.code,
          resultTitle: resultDetail.title,
          summary,
        });
        setSavedResultType(result.type);
      }
      setShowResult(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (showResult && answeredCount === test.questions.length && resultDetail) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
          <View style={styles.resultPanel}>
            <Text style={styles.eyebrow}>{t('tests.resultEyebrow')}</Text>
            <Text style={styles.resultName}>{resultDetail.title}</Text>
            <Text style={styles.resultText}>{resultDetail.description}</Text>
            <View style={styles.detailStack}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailTitle}>{t('tests.strengthsTitle')}</Text>
                <Text style={styles.detailText}>{resultDetail.strengths}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailTitle}>{t('tests.growthTitle')}</Text>
                <Text style={styles.detailText}>{resultDetail.growth}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailTitle}>{t('tests.relationshipsTitle')}</Text>
                <Text style={styles.detailText}>{resultDetail.relationships}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailTitle}>{t('tests.rhythmTitle')}</Text>
                <Text style={styles.detailText}>{resultDetail.rhythm}</Text>
              </View>
            </View>
            <View style={styles.scoreGrid}>
              {test.resultOrder.map((key) => (
                <Text key={key} style={styles.scoreText}>
                  {test.dimensions[key]}: {result.percentages[key] || 0}%
                </Text>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>{t('tests.backToPersonal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setAnswers({});
                setShowResult(false);
                setSavedResultType(null);
              }}
            >
              <Text style={styles.secondaryButtonText}>{t('tests.retakeTest')}</Text>
            </TouchableOpacity>
          </View>
        </BrandedScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>{test.title}</Text>
          <Text style={styles.meta}>{test.meta}</Text>
          <Text style={styles.helper}>{test.intro} {t('tests.genericHelperSuffix')}</Text>
          <Text style={styles.progress}>{answeredCount} / {test.questions.length}</Text>
        </View>

        {test.questions.map((question) => (
          <View
            key={question.id}
            style={[styles.questionCard, typeof answers[question.id] === 'number' && styles.questionCardAnswered]}
          >
            <Text style={styles.questionNumber}>{t('tests.questionNumber', { id: question.id })}</Text>
            <Text style={styles.questionText}>{question.text}</Text>
            <FivePointSlider value={answers[question.id]} onChange={(value) => setAnswer(question.id, value)} />
            <View style={styles.scaleLabelRow}>
              <Text style={styles.scaleLabel}>{test.lowLabel}</Text>
              <Text style={styles.scaleLabel}>{t('tests.scaleMiddle')}</Text>
              <Text style={styles.scaleLabel}>{test.highLabel}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.primaryButton, answeredCount < test.questions.length && styles.primaryButtonDisabled]}
          disabled={answeredCount < test.questions.length}
          onPress={() => void saveAndShowResult()}
        >
          <Text style={styles.primaryButtonText}>{isSaving ? t('tests.saving') : t('tests.showResult')}</Text>
        </TouchableOpacity>
        {missingQuestionIds.length ? (
          <Text style={styles.missingText}>
            {t('tests.missingQuestions', { ids: missingQuestionIds.slice(0, 8).join(', ') })}
            {missingQuestionIds.length > 8 ? t('tests.andMoreQuestions', { count: missingQuestionIds.length - 8 }) : ''}
          </Text>
        ) : null}
      </BrandedScrollView>
    </SafeAreaView>
  );
}

export function MbtiTestScreen(props: Props) {
  const testId = props.route.params.testId;
  if (!testId) {
    return <PersonalityTestSelectScreen navigation={props.navigation} profileId={props.route.params.profileId} />;
  }
  const genericTest = testId !== 'mbti' ? getPersonalityTests()[testId as PersonalityTestId] : null;
  if (genericTest) {
    return <GenericPersonalityTestScreen navigation={props.navigation} profileId={props.route.params.profileId} test={genericTest} />;
  }
  return <MbtiOnlyTestScreen {...props} />;
}

function PersonalityTestSelectScreen({
  navigation,
  profileId,
}: {
  navigation: Props['navigation'];
  profileId: string;
}) {
  const { t } = useTranslation();
  const testSelection = useMemo(() => buildTestSelection(t), [t]);
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>{t('tests.title')}</Text>
          <Text style={styles.helper}>{t('tests.selectHelper')}</Text>
        </View>
        <View style={styles.testGrid}>
          {testSelection.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={styles.testCard}
              activeOpacity={0.84}
              onPress={() => navigation.navigate('MbtiTest', { profileId, testId: test.id })}
            >
              <Text style={styles.testCardTitle}>{test.title.toLocaleUpperCase(getAppLanguage() === 'en' ? 'en-US' : 'tr-TR')}</Text>
              <Text style={styles.testCardMeta}>{test.meta}</Text>
              <Text style={styles.testCardDescription}>{test.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BrandedScrollView>
    </SafeAreaView>
  );
}

function MbtiOnlyTestScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const questions = getMbtiQuestions();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [savedResultType, setSavedResultType] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const missingQuestionIds = questions.filter((question) => typeof answers[question.id] !== 'number').map((question) => question.id);
  const result = useMemo(() => calculateResult(answers), [answers]);

  const setAnswer = (questionId: number, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const saveAndShowResult = async () => {
    if (answeredCount < questions.length || isSaving) return;
    const strings = getMbtiStrings();
    const description = getMbtiTypeDescriptions()[result.type];
    const summary = strings.buildMbtiSummary(result.type, description);
    setIsSaving(true);
    try {
      if (savedResultType !== result.type) {
        const nextState = await appendReplacingProfileTestResult({
          profileId: route.params.profileId,
          assistantId: 'testler',
          readingType: 'personality-test',
          surfacesRead: [],
          summary,
          testResult: {
            testId: 'mbti',
            testName: strings.mbtiTestName,
            resultCode: result.type,
            resultTitle: result.type,
            dimensions: {
              IE: result.scores.IE,
              SN: result.scores.SN,
              FT: result.scores.FT,
              JP: result.scores.JP,
            },
          },
          transcript: [
            {
              role: 'assistant',
              text: summary,
              timestamp: Date.now(),
            },
          ],
        });
        const readingId = nextState.readings[0]?.readingId;
        await appendUserStatedTestResult({
          profileId: route.params.profileId,
          readingId: readingId || `${Date.now()}`,
          testId: 'mbti',
          testName: strings.mbtiTestName,
          resultCode: result.type,
          resultTitle: result.type,
          summary,
        });
        setSavedResultType(result.type);
      }
      setShowResult(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (showResult && answeredCount === questions.length) {
    const detail = getMbtiTypeDetail()[result.type];
    const archetype = getMbtiTypeArchetypes()[result.type];
    const dimensions = dimensionMeaning(result.type, t);
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
          <View style={styles.resultPanel}>
            <Text style={styles.eyebrow}>{t('tests.mbtiResultEyebrow')}</Text>
            <Text style={styles.resultType}>{result.type}</Text>
            {archetype ? <Text style={styles.resultName}>{archetype.name}</Text> : null}
            <Text style={styles.resultText}>{getMbtiTypeDescriptions()[result.type]}</Text>
            {detail ? (
              <View style={styles.detailStack}>
                {archetype ? (
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailTitle}>{t('tests.archetypeWhyTitle')}</Text>
                    <Text style={styles.detailText}>{archetype.reason}</Text>
                  </View>
                ) : null}
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.lettersMeaningTitle')}</Text>
                  {dimensions.map((item) => (
                    <Text key={item.slice(0, 1)} style={styles.dimensionText}>{item}</Text>
                  ))}
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.mainThemeTitle')}</Text>
                  <Text style={styles.detailText}>{detail.theme}</Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.selfKnowledgeTitle')}</Text>
                  <Text style={styles.detailText}>
                    {detail.self} {t('tests.selfSuffix')}
                  </Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.strengthsTitle')}</Text>
                  <Text style={styles.detailText}>
                    {detail.strengths} {t('tests.strengthsSuffix')}
                  </Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.mbtiGrowthTitle')}</Text>
                  <Text style={styles.detailText}>
                    {detail.growth} {t('tests.growthSuffix')}
                  </Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.relationshipsTitle')}</Text>
                  <Text style={styles.detailText}>
                    {detail.relationships} {t('tests.relationshipsSuffix')}
                  </Text>
                </View>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailTitle}>{t('tests.workRhythmTitle')}</Text>
                  <Text style={styles.detailText}>
                    {detail.rhythm} {t('tests.rhythmSuffix')}
                  </Text>
                </View>
              </View>
            ) : null}
            <View style={styles.scoreGrid}>
              <Text style={styles.scoreText}>I/E: {result.scores.IE > 24 ? 'E' : 'I'}</Text>
              <Text style={styles.scoreText}>S/N: {result.scores.SN > 24 ? 'N' : 'S'}</Text>
              <Text style={styles.scoreText}>F/T: {result.scores.FT > 24 ? 'T' : 'F'}</Text>
              <Text style={styles.scoreText}>J/P: {result.scores.JP > 24 ? 'P' : 'J'}</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>{t('tests.backToPersonal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
            onPress={() => {
              setAnswers({});
              setShowResult(false);
              setSavedResultType(null);
            }}
            >
              <Text style={styles.secondaryButtonText}>{t('tests.retakeTest')}</Text>
            </TouchableOpacity>
          </View>
        </BrandedScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <BrandedScrollView contentContainerStyle={styles.content} showScrollToTop>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>{t('tests.mbtiTitle')}</Text>
          <Text style={styles.meta}>{t('tests.mbtiMeta')}</Text>
          <Text style={styles.helper}>
            {t('tests.mbtiHelper')}
          </Text>
          <Text style={styles.progress}>{answeredCount} / {questions.length}</Text>
        </View>

        {questions.map((question) => (
          <View
            key={question.id}
            style={[styles.questionCard, typeof answers[question.id] === 'number' && styles.questionCardAnswered]}
          >
            <Text style={styles.questionNumber}>{t('tests.questionNumber', { id: question.id })}</Text>
            <View style={styles.pairRow}>
              <Text style={styles.pairText}>{question.left}</Text>
              <Text style={[styles.pairText, styles.pairTextRight]}>{question.right}</Text>
            </View>
            <FivePointSlider value={answers[question.id]} onChange={(value) => setAnswer(question.id, value)} />
            <View style={styles.scaleLabelRow}>
              <Text style={styles.scaleLabel}>{t('tests.scaleLeft')}</Text>
              <Text style={styles.scaleLabel}>{t('tests.scaleMiddle')}</Text>
              <Text style={styles.scaleLabel}>{t('tests.scaleRight')}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.primaryButton, answeredCount < questions.length && styles.primaryButtonDisabled]}
          disabled={answeredCount < questions.length}
          onPress={() => void saveAndShowResult()}
        >
          <Text style={styles.primaryButtonText}>{isSaving ? t('tests.saving') : t('tests.showResult')}</Text>
        </TouchableOpacity>
        {missingQuestionIds.length ? (
          <Text style={styles.missingText}>
            {t('tests.missingQuestions', { ids: missingQuestionIds.slice(0, 8).join(', ') })}
            {missingQuestionIds.length > 8 ? t('tests.andMoreQuestions', { count: missingQuestionIds.length - 8 }) : ''}
          </Text>
        ) : null}
      </BrandedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14141E' },
  content: { padding: 18, paddingBottom: 34 },
  headerPanel: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  title: { color: '#FFF5E8', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  meta: { color: '#F6C38B', fontSize: 12, fontWeight: '800', marginBottom: 10 },
  helper: { color: 'rgba(212,165,116,0.78)', fontSize: 12, lineHeight: 18, marginBottom: 10 },
  progress: { color: '#E8C49A', fontSize: 12, fontWeight: '900' },
  questionCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.18)',
  },
  questionCardAnswered: {
    borderColor: 'rgba(125,220,154,0.42)',
    backgroundColor: 'rgba(125,220,154,0.06)',
  },
  questionNumber: { color: '#D4A574', fontSize: 11, fontWeight: '900', marginBottom: 6 },
  questionText: { color: '#FFF5E8', fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 12 },
  pairRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14 },
  pairText: { color: '#FFF5E8', fontSize: 13, fontWeight: '800', lineHeight: 18, flex: 1 },
  pairTextRight: { color: 'rgba(212,165,116,0.86)', textAlign: 'right' },
  optionRow: { gap: 8 },
  sliderWrap: { height: 44, marginHorizontal: 10, justifyContent: 'center' },
  sliderTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(212,165,116,0.28)',
  },
  sliderPointTouch: {
    position: 'absolute',
    width: 38,
    height: 38,
    marginLeft: -19,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderPoint: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'rgba(212,165,116,0.62)',
    backgroundColor: '#1E1E28',
  },
  sliderPointSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: '#F6C38B',
    backgroundColor: '#D4A574',
  },
  sliderKnob: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#F6C38B',
    backgroundColor: '#D4A574',
  },
  scaleLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  scaleLabel: { color: 'rgba(212,165,116,0.68)', fontSize: 10, fontWeight: '800' },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionButtonSelected: {
    borderColor: '#D4A574',
    backgroundColor: 'rgba(212,165,116,0.16)',
  },
  optionText: { color: 'rgba(255,255,255,0.74)', fontSize: 12, fontWeight: '700' },
  optionTextSelected: { color: '#F6C38B' },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#D4A574',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: { color: '#14141E', fontSize: 14, fontWeight: '900' },
  missingText: { color: '#F6C38B', fontSize: 12, fontWeight: '700', lineHeight: 18, marginTop: 10, textAlign: 'center' },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.42)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: '#F6C38B', fontSize: 13, fontWeight: '800' },
  resultPanel: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(30, 30, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.22)',
  },
  eyebrow: { color: '#D4A574', fontSize: 12, fontWeight: '900', marginBottom: 6 },
  resultType: { color: '#FFF5E8', fontSize: 42, fontWeight: '900', marginBottom: 10 },
  resultName: { color: '#F6C38B', fontSize: 20, fontWeight: '900', marginTop: -6, marginBottom: 10 },
  resultText: { color: 'rgba(212,165,116,0.82)', fontSize: 14, lineHeight: 21, marginBottom: 14 },
  detailStack: { gap: 10, marginBottom: 14 },
  detailBlock: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.16)',
  },
  testGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testCard: {
    width: '48.5%',
    minHeight: 132,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,130,82,0.2)',
    backgroundColor: 'rgba(0,0,0,0.16)',
    padding: 12,
    justifyContent: 'space-between',
  },
  testCardTitle: {
    color: '#FFF5E8',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginBottom: 6,
  },
  testCardMeta: {
    color: '#F6C38B',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    marginBottom: 6,
  },
  testCardDescription: {
    color: 'rgba(212,165,116,0.72)',
    fontSize: 10,
    lineHeight: 15,
  },
  detailTitle: { color: '#E8C49A', fontSize: 13, fontWeight: '900', marginBottom: 6 },
  detailText: { color: 'rgba(255,255,255,0.78)', fontSize: 13, lineHeight: 20 },
  dimensionText: { color: 'rgba(255,255,255,0.78)', fontSize: 13, lineHeight: 20, marginBottom: 6 },
  scoreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  scoreText: {
    minWidth: 76,
    color: '#F6C38B',
    fontSize: 12,
    fontWeight: '900',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.28)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
