import React, { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

// --- Minimal icons (React Native SVG) ---
const ArrowLeft = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    stroke={props.color || '#18181b'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 12H5" />
    <Path d="M12 19l-7-7 7-7" />
  </Svg>
);

const X = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 36}
    height={props.size || 36}
    stroke={props.color || '#a3a3a3'}
    strokeWidth={2.5}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 6L6 18" />
    <Path d="M6 6l12 12" />
  </Svg>
);

const Heart = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 36}
    height={props.size || 36}
    fill={props.fill || 'none'}
    stroke={props.color || '#ea580c'}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0l-.59.58-.57-.59a5.501 5.501 0 0 0-7.78 7.78l.59.58L12 21.35l7.13-7.38.59-.58a5.5 5.5 0 0 0 0-7.78z"
      fill={props.filled ? props.color || '#ea580c' : 'none'}
    />
  </Svg>
);

const Info = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 24}
    height={props.size || 24}
    stroke={props.color || '#737373'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 16v-4" />
    <Path d="M12 8h.01" />
  </Svg>
);

const Check = (props) => (
  <Svg
    viewBox="0 0 20 20"
    width={props.size || 20}
    height={props.size || 20}
    stroke={props.color || '#fff'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 10l4 4 8-8" />
  </Svg>
);

// 底部导航图标
const HomeIcon = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 22}
    height={props.size || 22}
    stroke={props.color || '#9ca3af'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 11l9-8 9 8" />
    <Path d="M5 12v8h14v-8" />
  </Svg>
);

const CalendarIcon = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 22}
    height={props.size || 22}
    stroke={props.color || '#9ca3af'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Path d="M8 2v4" />
    <Path d="M16 2v4" />
    <Path d="M3 10h18" />
  </Svg>
);

const HistoryIcon = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 22}
    height={props.size || 22}
    stroke={props.color || '#9ca3af'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 3v6h6" />
    <Path d="M21 12A9 9 0 1 1 6 5.3" />
    <Path d="M12 7v5l3 3" />
  </Svg>
);

const UserIcon = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 22}
    height={props.size || 22}
    stroke={props.color || '#9ca3af'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx={12} cy={8} r={4} />
    <Path d="M6 20c1.5-3 4-4 6-4s4.5 1 6 4" />
  </Svg>
);

const PlusIcon = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.size || 26}
    height={props.size || 26}
    stroke={props.color || '#fff'}
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

// --- 示例数据 ---
const recommendations = [
  {
    id: 1,
    shopName: '大米先生 (科技园店)',
    dishName: '番茄牛腩减脂汤粉',
    price: 32.5,
    originalPrice: 45,
    calories: 450,
    distance: '800m',
    time: '30 分钟',
    rating: 4.8,
    aiReason: '昨晚钠超标，推荐这份番茄牛腩粉',
    image:
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',
    platform: '美团',
  },
  {
    id: 2,
    shopName: 'Wagas 沃歌斯 (万象天地店)',
    dishName: '煎牛肉能量碗',
    price: 58.0,
    originalPrice: 65,
    calories: 380,
    distance: '1.2km',
    time: '40 分钟',
    rating: 4.9,
    aiReason: '距离目标热量还有空间，补充优质蛋白',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    platform: '美团',
  },
  {
    id: 3,
    shopName: '轻食主义 (南山大冲店)',
    dishName: '牛油果鸡胸肉全麦三明治',
    price: 28.9,
    originalPrice: 35,
    calories: 320,
    distance: '500m',
    time: '25 分钟',
    rating: 4.7,
    aiReason: '低碳水饱腹首选，完美契合减脂期',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    platform: '美团',
  },
];

const exampleDir = 'app-example';
const oldDirs = ['app', 'components', 'hooks', 'constants', 'scripts'];

/**
 * 口味初探页
 */
function TasteExplore({ onNavigate }) {
  const [swipes, setSwipes] = useState(0);
  const total = 5;

  const handleSwipe = () => {
    if (swipes < total) {
      setSwipes((s) => s + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FDFDFD' }}>
      {/* Header */}
      <View style={styles.tasteHeader}>
        <TouchableOpacity onPress={() => onNavigate('home')} style={{ padding: 7 }}>
          <ArrowLeft size={24} color="#18181b" />
        </TouchableOpacity>
        <Text style={styles.tasteHeaderTitle}>口味初探</Text>
      </View>

      {/* Title */}
      <View style={styles.tasteTitleWrap}>
        <Text style={styles.tasteTitle}>右滑想吃, 左滑无感</Text>
        <Text style={styles.tasteSubtitle}>让我们了解您的美食偏好</Text>
      </View>

      {/* Card */}
      <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 24 }}>
        <View style={styles.tasteCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
            }}
            resizeMode="cover"
            style={styles.tasteImage}
          />
          {/* Gradient Overlay */}
          <View style={StyleSheet.absoluteFillObject}>
            <Svg
              pointerEvents="none"
              style={styles.tasteGradient}
              viewBox="0 0 400 500"
            >
              <Rect x={0} y={0} width={400} height={500} rx={32} fill="url(#g)" />
              <Svg.Defs>
                <Svg.LinearGradient id="g" x1={0} y1={500} x2={0} y2={0}>
                  <Svg.Stop offset="0" stopColor="#000" stopOpacity="0.88" />
                  <Svg.Stop offset="0.5" stopColor="#000" stopOpacity="0.38" />
                  <Svg.Stop offset="1" stopColor="#fff" stopOpacity="0" />
                </Svg.LinearGradient>
              </Svg.Defs>
            </Svg>
          </View>

          {/* Content */}
          <View style={styles.tasteContent}>
            <View style={styles.tasteTag}>
              <Text style={styles.tasteTagText}>今日推荐</Text>
            </View>
            <Text style={styles.tasteDishTitle}>牛油果三明治拼盘</Text>
            <View style={styles.tasteMetaRow}>
              <Text style={styles.tasteMetaText}>⏱ 15 分钟</Text>
              <Text style={styles.tasteMetaText}>🔥 450 千卡</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.tasteActionsRow}>
          <View style={styles.tasteActionCol}>
            <TouchableOpacity onPress={handleSwipe} style={styles.tasteDislikeBtn}>
              <X size={36} color="#a3a3a3" />
            </TouchableOpacity>
            <Text style={styles.tasteDislikeText}>无感</Text>
          </View>

          <TouchableOpacity style={styles.tasteInfoBtn}>
            <Info size={24} color="#737373" />
          </TouchableOpacity>

          <View style={styles.tasteActionCol}>
            <TouchableOpacity onPress={handleSwipe} style={styles.tasteLikeBtn}>
              <Heart size={36} color="#ea580c" filled />
            </TouchableOpacity>
            <Text style={styles.tasteLikeText}>想吃</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.tasteProgressWrap}>
        <View style={styles.tasteProgressHeader}>
          <Text style={styles.tasteProgressText}>
            {swipes >= total ? '口味测算完成！' : `再选 ${total - swipes} 个就完成啦！`}
          </Text>
          <Text style={styles.tasteProgressCount}>
            {swipes} / {total}
          </Text>
        </View>

        <View style={styles.tasteProgressBarBg}>
          <View
            style={[
              styles.tasteProgressBarFill,
              { width: `${(swipes / total) * 100}%` },
            ]}
          />
        </View>

        {swipes >= total ? (
          <TouchableOpacity
            onPress={() => onNavigate('home')}
            activeOpacity={0.8}
            style={styles.tasteCTA}
          >
            <Check size={20} color="#fff" />
            <Text style={styles.tasteCTAText}>生成我的专属推荐</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.tasteHintText}>还差 {total - swipes} 个就完成啦！</Text>
        )}
      </View>
    </View>
  );
}

/**
 * Onboarding：身高体重 → 热量账户
 */
function Onboarding({ onComplete }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  function calcCalories() {
    const w = Number(weight);
    const h = Number(height);
    if (!w || !h) return 1800;
    const bmr = 21.6 * w + 370;
    return Math.round(bmr * 1.35);
  }

  const ready = !!height && !!weight;
  const calories = calcCalories();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={84}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={styles.onboardScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.onboardHeaderWrap}>
          <Text style={styles.onboardTitle}>
            定制你的{'\n'}
            <Text style={{ color: '#fb923c' }}>AI 饮食管家</Text>
          </Text>
          <Text style={styles.onboardSubtitle}>
            输入基础身体数据，生成专属热量账户
          </Text>
        </View>

        <View style={styles.onboardFormWrap}>
          <View style={{ marginBottom: 30 }}>
            <Text style={styles.onboardLabel}>身高 (cm)</Text>
            <TextInput
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="例如: 175"
              maxLength={3}
              style={styles.onboardInput}
              placeholderTextColor="#bbb"
              returnKeyType="next"
            />
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={styles.onboardLabel}>体重 (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder="例如: 65"
              maxLength={3}
              style={styles.onboardInput}
              placeholderTextColor="#bbb"
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={ready ? 0.7 : 1}
          onPress={() => {
            if (!ready) return;
            onComplete(calories);
          }}
          disabled={!ready}
          style={[
            styles.onboardBtn,
            { backgroundColor: ready ? '#fb923c' : '#e5e7eb' },
          ]}
        >
          <Text
            style={[
              styles.onboardBtnText,
              { color: ready ? '#fff' : '#bbb' },
            ]}
          >
            生成我的热量账户
          </Text>
        </TouchableOpacity>

        {ready && calories > 0 && (
          <Text style={styles.onboardHint}>
            推荐热量目标：{calories} kcal
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Profile：个人中心 + “项目一键重置（演示）”
 */
function Profile({ log, hasReset, onReset, onBack }) {
  return (
    <View style={styles.tabPage}>
      <Text style={styles.tabTitle}>个人中心</Text>
      <Text style={styles.tabText}>这里是“个人中心”Tab的内容。</Text>

      <View style={styles.resetDemoBlock}>
        <Text style={styles.resetHeader}>项目一键重置（演示）</Text>
        <Text style={styles.tips}>
          本页面模拟 PC 脚本的“重置”功能。{'\n\n'}
          在实际手机端无法真的移动或删除工程目录，只能体验操作过程。
        </Text>

        {!hasReset ? (
          <View style={styles.buttons}>
            <Button title="开始重置项目" onPress={onReset} color="#f97316" />
          </View>
        ) : (
          <View style={styles.logBox}>
            {log.map((l, idx) => (
              <Text key={idx} style={styles.logLine}>
                {l}
              </Text>
            ))}
            <Button title="返回" onPress={onBack} color="#6366f1" />
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * CameraScreen：占位页
 */
function CameraScreen({ onNavigate }) {
  return (
    <View style={styles.cameraWrap}>
      <Text style={styles.cameraTitle}>拍照识别（占位）</Text>
      <Text style={styles.cameraSub}>这里将来可以接入拍照识别功能。</Text>
      <TouchableOpacity
        style={styles.cameraBackBtn}
        onPress={() => onNavigate('home')}
      >
        <Text style={styles.cameraBackText}>返回首页</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * BottomNav：移动端底部导航
 */
function BottomNav({ current, onNavigate }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => onNavigate('home')}
        style={styles.bottomNavItem}
      >
        <HomeIcon color={current === 'home' ? '#f97316' : '#9ca3af'} />
        <Text
          style={[
            styles.bottomNavLabel,
            { color: current === 'home' ? '#f97316' : '#9ca3af' },
          ]}
        >
          首页
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onNavigate('explore')}
        style={styles.bottomNavItem}
      >
        <CalendarIcon color={current === 'explore' ? '#f97316' : '#9ca3af'} />
        <Text
          style={[
            styles.bottomNavLabel,
            { color: current === 'explore' ? '#f97316' : '#9ca3af' },
          ]}
        >
          计划
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomNavCenterWrap}>
        <TouchableOpacity
          onPress={() => onNavigate('camera')}
          style={styles.bottomNavCenterBtn}
        >
          <PlusIcon />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onNavigate('history')}
        style={styles.bottomNavItem}
      >
        <HistoryIcon color={current === 'history' ? '#f97316' : '#9ca3af'} />
        <Text
          style={[
            styles.bottomNavLabel,
            { color: current === 'history' ? '#f97316' : '#9ca3af' },
          ]}
        >
          历史
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onNavigate('profile')}
        style={styles.bottomNavItem}
      >
        <UserIcon color={current === 'profile' ? '#f97316' : '#9ca3af'} />
        <Text
          style={[
            styles.bottomNavLabel,
            { color: current === 'profile' ? '#f97316' : '#9ca3af' },
          ]}
        >
          个人中心
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * App 根组件（被 app/index.tsx 引用）
 */
function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState({
    targetCalories: 1800,
    currentCalories: 850,
  });
  const [toast, setToast] = useState('');
  const [log, setLog] = useState([]);
  const [hasReset, setHasReset] = useState(false);

  // Tab: 'home' | 'explore' | 'taste' | 'camera' | 'history' | 'profile'
  const [currentTab, setCurrentTab] = useState('home');
  const [cameraUI, setCameraUI] = useState('none');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1400);
  }

  const handleReset = (moveToExample) => {
    const tempLog = [];
    if (moveToExample) {
      tempLog.push(`📁 /${exampleDir} directory created.`);
    }
    oldDirs.forEach((dir) => {
      if (Math.random() > 0.3) {
        if (moveToExample) {
          tempLog.push(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          tempLog.push(`❌ /${dir} deleted.`);
        }
      } else {
        tempLog.push(`➡️ /${dir} does not exist, skipping.`);
      }
    });
    tempLog.push('📁 New /app directory created.');
    tempLog.push('📄 app/index.tsx created.');
    tempLog.push('📄 app/_layout.tsx created.');
    tempLog.push('');
    tempLog.push('✅ Project reset complete. Next steps:');
    tempLog.push(`1. Run 'npx expo start' to start a development server.`);
    tempLog.push(`2. Edit app/index.tsx to edit the main screen.`);
    if (moveToExample) {
      tempLog.push(
        `3. Delete the /${exampleDir} directory when you're done referencing it.`
      );
    }
    setLog(tempLog);
    setHasReset(true);
    showToast('模拟重置完成（仅演示）');
  };

  const handlePrompt = () => {
    Alert.alert(
      '选择操作',
      '要把现有文件移动到 /app-example 吗？（推荐，仅为演示，不会真实修改）',
      [
        { text: '移动到 /app-example', onPress: () => handleReset(true) },
        {
          text: '直接删除',
          style: 'destructive',
          onPress: () => handleReset(false),
        },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  function renderTabContent() {
    switch (currentTab) {
      case 'home':
        return (
          <View style={styles.tabPage}>
            <Text style={styles.tabTitle}>首页</Text>
            <Text style={styles.tabText}>
              这里可以展示今日概览、推荐餐单等内容。
            </Text>
            <View style={styles.cardList}>
              {recommendations.map((item) => (
                <View key={item.id} style={styles.cardItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardShop}>{item.shopName}</Text>
                    <Text style={styles.cardDish}>{item.dishName}</Text>
                    <Text style={styles.cardReason}>{item.aiReason}</Text>
                    <View style={styles.cardMetaRow}>
                      <Text style={styles.cardMetaText}>
                        🔥 {item.calories} kcal
                      </Text>
                      <Text style={styles.cardMetaText}>{item.time}</Text>
                      <Text style={styles.cardMetaText}>{item.distance}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setCurrentTab('taste')}
            >
              <Text style={styles.primaryBtnText}>去做口味初探</Text>
            </TouchableOpacity>
          </View>
        );
      case 'explore':
        return (
          <View style={styles.tabPage}>
            <Text style={styles.tabTitle}>计划</Text>
            <Text style={styles.tabText}>这里是“计划”Tab的内容。</Text>
          </View>
        );
      case 'taste':
        return <TasteExplore onNavigate={setCurrentTab} />;
      case 'camera':
        return <CameraScreen onNavigate={setCurrentTab} />;
      case 'history':
        return (
          <View style={styles.tabPage}>
            <Text style={styles.tabTitle}>历史记录</Text>
            <Text style={styles.tabText}>这里显示过往打卡、用餐记录。</Text>
          </View>
        );
      case 'profile':
        return (
          <Profile
            log={log}
            hasReset={hasReset}
            onReset={handlePrompt}
            onBack={() => {
              setHasReset(false);
              setLog([]);
            }}
          />
        );
      default:
        return null;
    }
  }

  // Onboarding 完成前显示引导页
  if (showOnboarding) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Onboarding
          onComplete={(cal) => {
            setUserProfile({
              targetCalories: cal,
              currentCalories: 0,
            });
            setShowOnboarding(false);
            showToast('已为你生成热量账户');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {toast ? (
        <View style={toastStyles.toastWrap}>
          <Text style={toastStyles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <View style={styles.flex1}>
        <ScrollView
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
        >
          {renderTabContent()}
        </ScrollView>
        <BottomNav current={currentTab} onNavigate={setCurrentTab} />
      </View>
    </SafeAreaView>
  );
}

// 导出给 app/index.tsx 使用
export default App;

// --- 样式 ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex1: {
    flex: 1,
  },
  wrapper: {
    paddingBottom: 96, // 预留底部导航空间
    paddingTop: 12,
  },

  // Tabs
  tabPage: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },

  // Home card list
  cardList: {
    marginTop: 6,
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardImage: {
    width: 96,
    height: 96,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardShop: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  cardDish: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardReason: {
    fontSize: 12,
    color: '#f97316',
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMetaText: {
    fontSize: 11,
    color: '#9ca3af',
  },

  primaryBtn: {
    marginTop: 4,
    backgroundColor: '#f97316',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // TasteExplore
  tasteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tasteHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181b',
    marginRight: 36,
  },
  tasteTitleWrap: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  tasteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tasteSubtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  tasteCard: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#aaa',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
    alignSelf: 'center',
  },
  tasteImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tasteGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tasteContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 28,
  },
  tasteTag: {
    backgroundColor: '#ea580c',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: '#ea580c',
    shadowOpacity: 0.23,
    shadowRadius: 2,
  },
  tasteTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tasteDishTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  tasteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 18,
  },
  tasteMetaText: {
    color: '#f3f4f6',
    fontWeight: '500',
    fontSize: 14,
  },
  tasteActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 34,
    marginTop: 30,
  },
  tasteActionCol: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: 6,
  },
  tasteDislikeBtn: {
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ccc',
    shadowOpacity: 0.11,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tasteDislikeText: {
    fontSize: 13,
    color: '#a3a3a3',
    fontWeight: 'bold',
  },
  tasteInfoBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  tasteLikeBtn: {
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea580c',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#ffedd5',
  },
  tasteLikeText: {
    fontSize: 13,
    color: '#ea580c',
    fontWeight: 'bold',
  },
  tasteProgressWrap: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  tasteProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  tasteProgressText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tasteProgressCount: {
    color: '#ea580c',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tasteProgressBarBg: {
    width: '100%',
    height: 13,
    backgroundColor: '#f3f4f6',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tasteProgressBarFill: {
    height: '100%',
    backgroundColor: '#ea580c',
    borderRadius: 99,
  },
  tasteCTA: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 13,
    paddingVertical: 13.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 6,
    marginTop: 1,
    shadowColor: '#694700',
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  tasteCTAText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 7,
  },
  tasteHintText: {
    textAlign: 'center',
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '500',
  },

  // Onboarding
  onboardScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 28,
  },
  onboardHeaderWrap: {
    marginTop: 38,
    marginBottom: 40,
  },
  onboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#18181b',
    lineHeight: 40,
  },
  onboardSubtitle: {
    color: '#64748b',
    fontSize: 15,
    marginBottom: 2,
  },
  onboardFormWrap: {
    flex: 1,
    marginBottom: 38,
  },
  onboardLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 7,
  },
  onboardInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 17,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  onboardBtn: {
    width: '100%',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  onboardBtnText: {
    fontWeight: 'bold',
    fontSize: 19,
  },
  onboardHint: {
    alignSelf: 'center',
    color: '#fb923c',
    fontWeight: 'bold',
    marginTop: 10,
  },

  // Reset demo
  resetDemoBlock: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  resetHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tips: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  buttons: {
    marginTop: 8,
  },
  logBox: {
    marginTop: 8,
    maxHeight: 220,
  },
  logLine: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 4,
  },

  // Camera
  cameraWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cameraTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cameraSub: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraBackBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  cameraBackText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // BottomNav
  bottomNav: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomNavCenterWrap: {
    position: 'relative',
    top: -16,
  },
  bottomNavCenterBtn: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
});

const toastStyles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    top: 18,
    left: 16,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(17,24,39,0.92)',
    zIndex: 20,
  },
  toastText: {
    color: '#f9fafb',
    fontSize: 13,
    textAlign: 'center',
  },
});