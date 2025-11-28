import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  PenTool,
  Stethoscope,
  BookOpen,
  Moon,
  Sun,
  Plus,
  Calendar,
  Send,
  CheckCircle,
  Clock,
  Trash2,
  AlertCircle,
  User,
  Book,
  Share2,
  WifiOff,
  Heart,
  ArrowRightLeft,
  Flag,
  Megaphone,
  ArrowUpRight,
  Search,
  BarChart3,
  X,
  Briefcase,
  Users,
  Bell,
  LogOut,
  Lock,
  Mail,
  ShieldCheck,
  Wifi,
  MessageSquare,
  Forward,
  ChevronRight,
  UserCheck,
  Edit2,
  Save,
  Image as ImageIcon,
  Smile,
  Copy,
  Download,
  Eye,
} from "lucide-react";

// ---------------------------------------------------------
// 1. استيراد دوال Firebase
// ---------------------------------------------------------
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  arrayUnion,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// ---------------------------------------------------------
// 2. إعدادات الاتصال
// ---------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD5D0hMQS1MNpXeFVH8LyNVaRvfnIGLT0g",
  authDomain: "me3oan-task.firebaseapp.com",
  projectId: "me3oan-task",
  storageBucket: "me3oan-task.firebasestorage.app",
  messagingSenderId: "758849340072",
  appId: "1:758849340072:web:2e76cd73dfc139ccc5389d",
  measurementId: "G-X024XN5Z4P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ---------------------------------------------------------
// 3. البيانات الثابتة
// ---------------------------------------------------------
const DEPARTMENTS = [
  {
    id: "educational",
    name: "القسم التعليمي",
    icon: BookOpen,
    color: "bg-blue-600",
    activeBg: "bg-blue-600",
    hoverBg: "hover:bg-blue-700",
    activeText: "text-white",
    primaryColor: "text-blue-600",
  },
  {
    id: "medical",
    name: "القسم الطبي",
    icon: Stethoscope,
    color: "bg-teal-500",
    activeBg: "bg-teal-500",
    hoverBg: "hover:bg-teal-600",
    activeText: "text-white",
    primaryColor: "text-teal-600",
  },
  {
    id: "dawah",
    name: "القسم الدعوي",
    icon: Megaphone,
    color: "bg-purple-600",
    activeBg: "bg-purple-600",
    hoverBg: "hover:bg-purple-700",
    activeText: "text-white",
    primaryColor: "text-purple-600",
  },
  {
    id: "charity",
    name: "القسم الخيري",
    icon: Heart,
    color: "bg-rose-500",
    activeBg: "bg-rose-500",
    hoverBg: "hover:bg-rose-600",
    activeText: "text-white",
    primaryColor: "text-rose-500",
  },
  {
    id: "art",
    name: "الإخراج الفني",
    icon: PenTool,
    color: "bg-orange-500",
    activeBg: "bg-orange-500",
    hoverBg: "hover:bg-orange-600",
    activeText: "text-white",
    primaryColor: "text-orange-600",
  },
  {
    id: "general",
    name: "عام / غير محدد",
    icon: LayoutDashboard,
    color: "bg-gray-600",
    activeBg: "bg-gray-600",
    hoverBg: "hover:bg-gray-700",
    activeText: "text-white",
    primaryColor: "text-gray-600",
  },
];

const QUOTES = {
  educational: [
    "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    "العلم نور",
    "اطلبوا العلم من المهد إلى اللحد",
  ],
  medical: [
    "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
    "نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ",
  ],
  dawah: [
    "وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ",
    "بلغوا عني ولو آية",
  ],
  charity: [
    "لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ",
    "الصدقة تطفئ غضب الرب",
  ],
  art: ["إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ", "الإتقان عبادة"],
  general: ["يد الله مع الجماعة", "وتعاونوا على البر والتقوى"],
};

const PRIORITIES = {
  urgent: {
    label: "مستعجل جداً",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Flag,
  },
  high: {
    label: "مهم",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
  },
  normal: {
    label: "عادي",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  low: {
    label: "غير هام",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: Clock,
  },
};

// ---------------------------------------------------------
// المكون الرئيسي (Root Component)
// ---------------------------------------------------------
export default function Ma3wanTaskApp() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isNameSet, setIsNameSet] = useState(true);

  useEffect(() => {
    if (!document.getElementById("tailwind-script")) {
      const script = document.createElement("script");
      script.id = "tailwind-script";
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        if (window.tailwind) {
          window.tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  gray: { 750: "#2d3748", 850: "#1a202c", 950: "#0d1117" },
                },
              },
            },
          };
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) setIsCodeVerified(false);
      if (currentUser && !currentUser.displayName) {
        setIsNameSet(false);
      } else {
        setIsNameSet(true);
      }
    });
    return () => unsubscribe();
  }, []);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 font-sans">
        جاري التحميل...
      </div>
    );
  if (!user) return <AuthScreen />;
  if (!isCodeVerified)
    return <SecretCodeScreen onSuccess={() => setIsCodeVerified(true)} />;
  if (!isNameSet)
    return <NameSetupScreen user={user} onSuccess={() => setIsNameSet(true)} />;

  return <MainApp user={user} />;
}

// ---------------------------------------------------------
// شاشة تسجيل الاسم
// ---------------------------------------------------------
function NameSetupScreen({ user, onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name });
      onSuccess();
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الاسم");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
          <User size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          مرحباً بك في معوان!
        </h2>
        <p className="text-gray-500 mb-6">
          يرجى كتابة اسمك الحقيقي ليظهر لزملائك في الشات والمهام.
        </p>
        <form onSubmit={handleSaveName} className="space-y-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center"
            placeholder="الاسم الثلاثي أو اللقب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            {loading ? "جاري الحفظ..." : "بدء الاستخدام"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// شاشة الكود السري
// ---------------------------------------------------------
function SecretCodeScreen({ onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === "Me3oan2026") {
      onSuccess();
    } else {
      setError("الكود السري غير صحيح 🚫");
      setCode("");
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <div className="h-2 w-full bg-indigo-500 absolute top-0"></div>
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">تحقق أمني إضافي</h2>
          <p className="text-gray-500 text-sm mt-2">
            يرجى إدخال كود الوصول الخاص بالفريق
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 outline-none transition"
              placeholder="أدخل الكود هنا"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm font-bold animate-pulse">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg"
            >
              تحقق ودخول
            </button>
          </form>
          <button
            onClick={handleLogout}
            className="mt-6 text-sm text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition"
          >
            <LogOut size={14} /> تسجيل خروج
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// شاشة تسجيل الدخول
// ---------------------------------------------------------
function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "بيانات الدخول غير صحيحة"
          : err.message
      );
    }
    setLoading(false);
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4 font-sans"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 text-center bg-indigo-50">
          <img
            src="https://i.postimg.cc/prX6tLfC/mʿwan-task-lwj.png"
            alt="logo"
            className="w-20 h-20 mx-auto mb-4 bg-transparent p-1 object-contain filter brightness-0 invert-0"
          />
          <h1 className="text-2xl font-bold text-indigo-900">معوان تاسك</h1>
          <p className="text-gray-500 text-sm mt-2">
            نظام إدارة المهام المركزي
          </p>
        </div>
        <form onSubmit={handleAuth} className="p-8 space-y-5">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <div className="relative">
            <Mail className="absolute top-3 right-3 text-gray-400" size={20} />
            <input
              type="email"
              required
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 outline-none"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3 right-3 text-gray-400" size={20} />
            <input
              type="password"
              required
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 outline-none"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700"
          >
            {loading ? "..." : isLogin ? "دخول" : "تسجيل"}
          </button>
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-indigo-600 font-bold mr-1 hover:underline"
              >
                {isLogin ? "أنشئ حساباً الآن" : "سجل دخولك"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// التطبيق الرئيسي
// ---------------------------------------------------------
function MainApp({ user }) {
  const [activeDeptId, setActiveDeptId] = useState("educational");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [managementMeeting, setManagementMeeting] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isChatUnlocked, setIsChatUnlocked] = useState(false);

  const [isManagementMode, setIsManagementMode] = useState(false);
  const [isMySpaceMode, setIsMySpaceMode] = useState(false);
  const [adminTasks, setAdminTasks] = useState([]);
  const [privateTasks, setPrivateTasks] = useState([]);
  const [showAdminMineOnly, setShowAdminMineOnly] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isFirstLoad = useRef(true);

  const [newTask, setNewTask] = useState({
    title: "",
    details: "",
    deadline: "",
    priority: "normal",
    targetDept: "",
  });
  const [newAdminTask, setNewAdminTask] = useState({
    title: "",
    details: "",
    status: "pending",
    deadline: "",
    priority: "normal",
  });
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [newMeeting, setNewMeeting] = useState({
    topic: "",
    date: "",
    time: "",
  });
  const [newPrivateTask, setNewPrivateTask] = useState({
    title: "",
    details: "",
    status: "pending",
    priority: "normal",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);

  const [eduType, setEduType] = useState("note");
  const [eduData, setEduData] = useState({
    subjectName: "",
    noteType: "",
    batchNumber: "",
    requestType: "",
  });

  useEffect(() => {
    setNewTask((prev) => ({ ...prev, targetDept: activeDeptId }));
  }, [activeDeptId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAdminAccess = () => {
    const password = prompt("أدخل رمز المدير للإجراءات الحساسة:");
    if (password === "1234566") return true;
    showToast("رمز المرور خاطئ", "error");
    return false;
  };

  const unlockChat = () => {
    if (isChatUnlocked) {
      setShowChat(true);
    } else {
      const password = prompt("أدخل رمز الشات:");
      if (password === "1234566") {
        setIsChatUnlocked(true);
        setShowChat(true);
      } else {
        showToast("رمز الشات خاطئ", "error");
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm("هل تريد تسجيل الخروج؟")) await signOut(auth);
  };

  const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
      showToast("لا توجد بيانات للتصدير", "error");
      return;
    }
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }
    const csvData = `\uFEFF${csvRows.join("\n")}`;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const deptQuotes = QUOTES[activeDeptId] || QUOTES["educational"];
    const randomQuote =
      deptQuotes[Math.floor(Math.random() * deptQuotes.length)];
    setCurrentQuote(randomQuote);
  }, [activeDeptId]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    setLoading(true);
    const tasksQuery = query(
      collection(db, "tasks"),
      orderBy("createdAtTimestamp", "desc")
    );
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
      if (!isFirstLoad.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newTask = change.doc.data();
            if (newTask.createdBy === user.email) return;
            const deptName = DEPARTMENTS.find(
              (d) => d.id === newTask.sourceDept
            )?.name;
            const newNotif = {
              id: change.doc.id,
              text: `نشاط جديد في ${deptName}: ${newTask.title}`,
              time: new Date().toLocaleTimeString("ar-EG"),
              read: false,
            };
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            showToast(`تنبيه جديد في ${deptName}`, "info");
          }
        });
      } else {
        isFirstLoad.current = false;
      }
      setLoading(false);
    });

    const adminTasksQuery = query(
      collection(db, "management_tasks"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeAdminTasks = onSnapshot(adminTasksQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAdminTasks(data);
    });

    const privateTasksQuery = query(
      collection(db, "private_tasks"),
      where("createdBy", "==", user.email)
    );
    const unsubscribePrivateTasks = onSnapshot(
      privateTasksQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrivateTasks(data);
      }
    );

    const eventsQuery = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      },
      (error) => console.error("Events Error:", error)
    );

    const meetingQuery = query(
      collection(db, "management_meetings"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsubscribeMeeting = onSnapshot(meetingQuery, (snapshot) => {
      if (!snapshot.empty)
        setManagementMeeting({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      else setManagementMeeting(null);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeAdminTasks();
      unsubscribePrivateTasks();
      unsubscribeEvents();
      unsubscribeMeeting();
    };
  }, [user.email]);

  const activeDept = DEPARTMENTS.find((d) => d.id === activeDeptId);
  const markNotificationsRead = () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu) setUnreadCount(0);
  };
  const handleSaveMeeting = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "management_meetings"), {
      ...newMeeting,
      createdAt: Date.now(),
    });
    setNewMeeting({ topic: "", date: "", time: "" });
    setShowMeetingModal(false);
    showToast("تم نشر الاجتماع");
  };
  const clearMeeting = async () => {
    if (checkAdminAccess() && managementMeeting)
      await deleteDoc(doc(db, "management_meetings", managementMeeting.id));
  };
  const openMeetingModal = () =>
    checkAdminAccess() && setShowMeetingModal(true);
  const toggleManagementMode = () =>
    checkAdminAccess() && setIsManagementMode(true);

  const handleAddTask = async (e) => {
    e.preventDefault();
    let finalTitle = newTask.title;
    let finalDetails = newTask.details;
    const targetDept = newTask.targetDept || activeDeptId;

    if (activeDeptId === "educational" && targetDept === "educational") {
      if (eduType === "note") {
        if (!eduData.subjectName) return showToast("أكمل البيانات", "error");
        finalTitle = `مذكرة: ${eduData.subjectName} - ${eduData.batchNumber}`;
        finalDetails = `النوع: ${eduData.noteType}\nملاحظات: ${newTask.details}`;
      } else {
        if (!eduData.requestType) return showToast("أكمل البيانات", "error");
        finalTitle = `سوشيال: ${eduData.requestType}`;
      }
    } else {
      if (!newTask.title) return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title: finalTitle,
        details: finalDetails,
        deadline: newTask.deadline,
        priority: newTask.priority,
        sourceDept: targetDept,
        forwardedTo: null,
        status: "pending",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        createdAtTimestamp: Date.now(),
        createdBy: user.email,
        createdByName: user.displayName,
      });
      setNewTask({
        title: "",
        details: "",
        deadline: "",
        priority: "normal",
        targetDept: activeDeptId,
      });
      setEduData({
        subjectName: "",
        noteType: "",
        batchNumber: "",
        requestType: "",
      });
      showToast("تمت الإضافة بنجاح");
    } catch (err) {
      showToast("خطأ في الإضافة", "error");
    }
  };

  const handleAddAdminTask = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "management_tasks"), {
      ...newAdminTask,
      createdBy: user.email,
      createdAt: Date.now(),
      createdDate: new Date().toLocaleDateString("ar-EG"),
    });
    setNewAdminTask({
      title: "",
      details: "",
      status: "pending",
      deadline: "",
      priority: "normal",
    });
  };
  const handleAddPrivateTask = async (e) => {
    e.preventDefault();
    if (!newPrivateTask.title) return;
    await addDoc(collection(db, "private_tasks"), {
      ...newPrivateTask,
      createdBy: user.email,
      createdAt: Date.now(),
      status: "pending",
      createdDate: new Date().toLocaleDateString("ar-EG"),
    });
    setNewPrivateTask({
      title: "",
      details: "",
      status: "pending",
      priority: "normal",
    });
  };
  const handleAddEvent = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "events"), {
      title: newEvent.title,
      date: newEvent.date,
      deptId: activeDeptId,
      createdAt: Date.now(),
    });
    setNewEvent({ title: "", date: "" });
    showToast("تمت إضافة الحدث");
  };
  const forwardTask = async (originalTask, targetDeptId) => {
    try {
      const targetDeptName = DEPARTMENTS.find(
        (d) => d.id === targetDeptId
      )?.name;
      const newTaskData = {
        title: originalTask.title,
        details: originalTask.details,
        deadline: originalTask.deadline,
        priority: originalTask.priority,
        sourceDept: targetDeptId,
        forwardedFrom: activeDeptId,
        status: "pending",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        createdAtTimestamp: Date.now(),
        createdBy: user.email,
        createdByName: user.displayName,
      };
      await addDoc(collection(db, "tasks"), newTaskData);
      const taskRef = doc(db, "tasks", originalTask.id);
      await updateDoc(taskRef, { forwardedTo: targetDeptId });
      showToast(`تم إرسال نسخة إلى ${targetDeptName}`);
    } catch (err) {
      showToast("خطأ في التحويل", "error");
    }
  };

  const toggleStatus = async (
    taskId,
    currentStatus,
    collectionName = "tasks"
  ) => {
    await updateDoc(doc(db, collectionName, taskId), {
      status: currentStatus === "completed" ? "pending" : "completed",
    });
  };
  const deleteTask = async (taskId, collectionName = "tasks") => {
    if (window.confirm("حذف؟"))
      await deleteDoc(doc(db, collectionName, taskId));
  };
  const deleteEvent = async (eventId) => {
    if (window.confirm("حذف؟")) await deleteDoc(doc(db, "events", eventId));
  };
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditFormData(task);
  };
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditFormData({});
  };
  const saveEditing = async (collectionName) => {
    try {
      await updateDoc(doc(db, collectionName, editingTaskId), editFormData);
      setEditingTaskId(null);
      showToast("تم التعديل بنجاح");
    } catch (err) {
      showToast("فشل التعديل", "error");
    }
  };
  const filterTasks = (taskList) =>
    taskList.filter(
      (t) =>
        (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.details.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterStatus === "all" ? true : t.status === filterStatus)
    );

  const rawMyDeptTasks = tasks.filter(
    (t) => t.sourceDept === activeDeptId && !t.forwardedFrom
  );
  const rawIncomingTasks = tasks.filter(
    (t) => t.sourceDept === activeDeptId && t.forwardedFrom
  );
  const myDeptTasks = filterTasks(rawMyDeptTasks);
  const incomingTasks = filterTasks(rawIncomingTasks);
  const deptEvents = events.filter((e) => e.deptId === activeDeptId);
  const completedCount = tasks.filter(
    (t) => t.sourceDept === activeDeptId && t.status === "completed"
  ).length;
  const totalCount = tasks.filter((t) => t.sourceDept === activeDeptId).length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (isMySpaceMode) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div
          className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-20"
          dir="rtl"
        >
          <header className="bg-gray-800 p-4 text-white flex justify-between items-center sticky top-0 z-30 shadow-md">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <User size={24} className="text-teal-400" /> مساحتي الخاصة
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(privateTasks, "MyPrivateTasks")}
                className="bg-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={16} /> تصدير
              </button>
              <button
                onClick={() => setIsMySpaceMode(false)}
                className="bg-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                عودة
              </button>
            </div>
          </header>
          <main className="max-w-6xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                إضافة ملاحظة / مهمة خاصة
              </h3>
              <form onSubmit={handleAddPrivateTask} className="flex gap-2">
                <input
                  className="flex-1 p-3 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder="ماذا تريد أن تنجز؟"
                  value={newPrivateTask.title}
                  onChange={(e) =>
                    setNewPrivateTask({
                      ...newPrivateTask,
                      title: e.target.value,
                    })
                  }
                />
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-6 rounded-lg font-bold hover:bg-teal-700"
                >
                  إضافة
                </button>
              </form>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="p-4">المهمة</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {privateTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td
                          className={`p-4 font-medium dark:text-white ${
                            task.status === "completed"
                              ? "line-through text-gray-400"
                              : ""
                          }`}
                        >
                          {task.title}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {task.status === "completed" ? "مكتمل" : "جاري"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">
                          {task.createdDate}
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <button
                            onClick={() =>
                              toggleStatus(
                                task.id,
                                task.status,
                                "private_tasks"
                              )
                            }
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id, "private_tasks")}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {privateTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-6 text-center text-gray-400"
                        >
                          لا توجد بيانات
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isManagementMode) {
    const filteredAdminTasks = adminTasks.filter((t) =>
      showAdminMineOnly ? t.createdBy === user.email : true
    );
    return (
      <div className={darkMode ? "dark" : ""}>
        <div
          className="min-h-screen bg-gray-900 text-gray-100 font-sans transition-colors duration-300 pb-20"
          dir="rtl"
        >
          <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-30 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="text-indigo-500" size={28} />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    غرفة القيادة المركزية
                  </h1>
                  <p className="text-xs text-gray-400">إدارة المهام العليا</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    exportToCSV(filteredAdminTasks, "ManagementTasks")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"
                >
                  <Download size={16} /> تصدير
                </button>
                <button
                  onClick={() => setShowAdminMineOnly(!showAdminMineOnly)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                    showAdminMineOnly
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  <User size={16} /> خاص بي
                </button>
                <button
                  onClick={() => setIsManagementMode(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                >
                  خروج
                </button>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="text-green-400" /> إضافة مهمة إدارية
              </h3>
              <form
                onSubmit={handleAddAdminTask}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
              >
                <div className="md:col-span-3">
                  <input
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    placeholder="اسم المهمة"
                    value={newAdminTask.title}
                    onChange={(e) =>
                      setNewAdminTask({
                        ...newAdminTask,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <input
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    placeholder="التفاصيل..."
                    value={newAdminTask.details}
                    onChange={(e) =>
                      setNewAdminTask({
                        ...newAdminTask,
                        details: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="date"
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    value={newAdminTask.deadline}
                    onChange={(e) =>
                      setNewAdminTask({
                        ...newAdminTask,
                        deadline: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <select
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    value={newAdminTask.priority}
                    onChange={(e) =>
                      setNewAdminTask({
                        ...newAdminTask,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="normal">عادي</option>
                    <option value="urgent">مستعجل</option>
                    <option value="high">مهم</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded font-bold"
                  >
                    حفظ
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-gray-750 text-gray-400 font-medium">
                    <tr>
                      <th className="p-4">المهمة</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">الأولوية</th>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">بواسطة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-gray-300">
                    {filteredAdminTasks.map((task) => {
                      const isEditing = editingTaskId === task.id;
                      const priority =
                        PRIORITIES[task.priority] || PRIORITIES.normal;
                      return (
                        <tr
                          key={task.id}
                          className="hover:bg-gray-700/50 transition"
                        >
                          <td className="p-4">
                            {isEditing ? (
                              <input
                                className="bg-gray-600 text-white p-1 rounded w-full"
                                value={editFormData.title}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    title: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <div className="font-bold text-white max-w-xs truncate">
                                {task.title}
                                <div className="text-xs text-gray-500 font-normal">
                                  {task.details}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                task.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {task.status === "completed" ? "مكتمل" : "جاري"}
                            </span>
                          </td>
                          <td className="p-4">
                            {isEditing ? (
                              <select
                                className="bg-gray-600 text-white p-1 rounded"
                                value={editFormData.priority}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    priority: e.target.value,
                                  })
                                }
                              >
                                <option value="normal">عادي</option>
                                <option value="urgent">مستعجل</option>
                                <option value="high">مهم</option>
                              </select>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-2 h-2 rounded-full ${priority.dot}`}
                                ></div>
                                <span>{priority.label}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-gray-400">
                            {isEditing ? (
                              <input
                                type="date"
                                className="bg-gray-600 text-white p-1 rounded w-24"
                                value={editFormData.deadline}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    deadline: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <div>
                                {task.createdDate}
                                <div className="text-[10px]">
                                  {task.deadline
                                    ? `موعد: ${task.deadline}`
                                    : ""}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-xs text-gray-500 truncate max-w-[100px]">
                            {task.createdBy?.split("@")[0]}
                          </td>
                          <td className="p-4 flex justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() =>
                                    saveEditing("management_tasks")
                                  }
                                  className="p-1.5 hover:bg-green-600 rounded text-green-400 hover:text-white"
                                >
                                  <Save size={16} />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-1.5 hover:bg-red-600 rounded text-red-400 hover:text-white"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(task)}
                                  className="p-1.5 hover:bg-gray-600 rounded text-blue-400"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    toggleStatus(
                                      task.id,
                                      task.status,
                                      "management_tasks"
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-600 rounded text-green-400"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteTask(task.id, "management_tasks")
                                  }
                                  className="p-1.5 hover:bg-gray-600 rounded text-red-400"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 pb-20"
        dir="rtl"
      >
        <ChatComponent
          user={user}
          db={db}
          departments={DEPARTMENTS}
          showToast={showToast}
          isOpen={showChat}
          setIsOpen={setShowChat}
          checkAdminAccess={checkAdminAccess}
        />
        {!showChat && (
          <button
            onClick={unlockChat}
            className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:bg-indigo-700 transition hover:scale-110"
          >
            <MessageSquare size={24} />
          </button>
        )}
        {toast && (
          <div
            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl text-white font-bold text-sm flex items-center gap-2 animate-bounce ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "info"
                ? "bg-blue-600"
                : "bg-green-600"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} />
            ) : toast.type === "info" ? (
              <Bell size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            {toast.message}
          </div>
        )}
        {showMeetingModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
              <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <Briefcase size={20} /> جدولة اجتماع
                </h3>
                <button onClick={() => setShowMeetingModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveMeeting} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    الموضوع
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={newMeeting.topic}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, topic: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      التاريخ
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      value={newMeeting.date}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الساعة
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                      value={newMeeting.time}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold"
                >
                  نشر
                </button>
              </form>
            </div>
          </div>
        )}
        <header className="bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-gray-950 dark:to-black shadow-lg sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/prX6tLfC/mʿwan-task-lwj.png"
                alt="logo"
                className="w-14 h-14 bg-white/10 rounded p-1"
              />
              <div>
                <h1 className="text-2xl font-bold">معوان تاسك</h1>
                <p className="text-lg text-blue-200 font-medium max-w-md hidden md:block italic">
                  "{currentQuote}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMySpaceMode(true)}
                className="p-2 rounded-full bg-teal-500/30 hover:bg-teal-500/50 text-white border border-teal-400/30"
                title="مساحتي الخاصة"
              >
                <User size={18} />
              </button>
              <button
                onClick={markNotificationsRead}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-900"></span>
                )}
              </button>
              {showNotifMenu && (
                <div className="absolute top-12 left-10 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 z-50 max-h-64 overflow-y-auto">
                  <div className="p-3 border-b dark:border-gray-700">
                    <h4 className="text-xs font-bold dark:text-gray-300">
                      الإشعارات
                    </h4>
                  </div>
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-3 border-b dark:border-gray-700 text-xs dark:text-gray-200"
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={openMeetingModal}
                className="p-2 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-indigo-400/30"
                title="اجتماع"
              >
                <Briefcase size={18} />
              </button>
              <button
                onClick={toggleManagementMode}
                className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 text-white border border-purple-400/30"
                title="لوحة القيادة"
              >
                <LayoutDashboard size={18} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500/30 hover:bg-red-500/50 text-white"
                title="خروج"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto pb-0 no-scrollbar">
            {DEPARTMENTS.filter((d) => d.id !== "general").map((dept) => {
              const isActive = activeDeptId === dept.id;
              const incomingCount = tasks.filter(
                (t) => t.sourceDept === dept.id && t.forwardedFrom
              ).length;
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    setActiveDeptId(dept.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-4 transition-all whitespace-nowrap ${
                    isActive
                      ? `border-white text-white bg-white/10`
                      : "border-transparent text-blue-200 hover:bg-white/5"
                  }`}
                >
                  <dept.icon size={16} />
                  {dept.name}
                  {incomingCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full animate-pulse">
                      {incomingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Plus size={18} className={activeDept.primaryColor} /> تسجيل
                مهمة جديدة
              </h3>
              <form onSubmit={handleAddTask} className="space-y-3">
                <div className="relative group">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    القسم التابع له المهمة
                  </label>
                  <select
                    className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs"
                    value={newTask.targetDept || activeDeptId}
                    onChange={(e) =>
                      setNewTask({ ...newTask, targetDept: e.target.value })
                    }
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                {activeDeptId === "educational" &&
                (newTask.targetDept === "educational" ||
                  !newTask.targetDept) ? (
                  <div className="bg-blue-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm mb-2">
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setEduType("note")}
                        className={`flex-1 py-1 rounded ${
                          eduType === "note"
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-600 text-gray-600"
                        }`}
                      >
                        مذكرة
                      </button>
                      <button
                        type="button"
                        onClick={() => setEduType("social")}
                        className={`flex-1 py-1 rounded ${
                          eduType === "social"
                            ? "bg-indigo-600 text-white"
                            : "bg-white dark:bg-gray-600 text-gray-600"
                        }`}
                      >
                        سوشيال
                      </button>
                    </div>
                    {eduType === "note" ? (
                      <div className="space-y-2">
                        <input
                          className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="اسم المادة"
                          value={eduData.subjectName}
                          onChange={(e) =>
                            setEduData({
                              ...eduData,
                              subjectName: e.target.value,
                            })
                          }
                        />
                        <div className="flex gap-2">
                          <input
                            className="w-1/2 p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="النوع"
                            value={eduData.noteType}
                            onChange={(e) =>
                              setEduData({
                                ...eduData,
                                noteType: e.target.value,
                              })
                            }
                          />
                          <input
                            className="w-1/2 p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                            placeholder="الدفعة"
                            value={eduData.batchNumber}
                            onChange={(e) =>
                              setEduData({
                                ...eduData,
                                batchNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        className="w-full p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="المطلوب..."
                        value={eduData.requestType}
                        onChange={(e) =>
                          setEduData({
                            ...eduData,
                            requestType: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ) : (
                  <input
                    className="w-full p-2.5 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 outline-none text-sm"
                    placeholder="عنوان المهمة"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                )}
                <textarea
                  className="w-full p-2.5 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 outline-none text-sm resize-none h-20"
                  placeholder="التفاصيل..."
                  value={newTask.details}
                  onChange={(e) =>
                    setNewTask({ ...newTask, details: e.target.value })
                  }
                ></textarea>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white text-xs"
                    value={newTask.deadline}
                    onChange={(e) =>
                      setNewTask({ ...newTask, deadline: e.target.value })
                    }
                  />
                  <select
                    className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white text-xs"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="urgent">مستعجل جداً</option>
                    <option value="high">مهم</option>
                    <option value="normal">عادي</option>
                    <option value="low">غير هام</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white font-bold text-sm shadow-md hover:opacity-90 transition ${activeDept.color}`}
                >
                  <Plus size={16} className="inline ml-1" /> إضافة
                </button>
              </form>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-pink-500" /> أحداث{" "}
                {activeDept.name}
              </h3>
              <form onSubmit={handleAddEvent} className="space-y-2 mb-4">
                <input
                  className="w-full p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                  placeholder="وصف الحدث الجديد..."
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 transition shadow-sm flex items-center justify-center shrink-0"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </form>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {deptEvents.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    لا توجد أحداث قادمة
                  </p>
                )}
                {deptEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded border-r-2 border-pink-400"
                  >
                    <div>
                      <p className="text-xs font-bold dark:text-gray-200">
                        {ev.title}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {ev.date}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute top-2.5 right-3 text-gray-400"
                />
                <input
                  className="w-full pr-10 pl-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700/50 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="بحث في المهام..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {["all", "pending", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      filterStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {status === "all"
                      ? "الكل"
                      : status === "pending"
                      ? "قيد التنفيذ"
                      : "مكتملة"}
                  </button>
                ))}
              </div>
            </div>
            {loading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm">جاري تحميل البيانات...</p>
              </div>
            )}
            {!loading && (
              <>
                {incomingTasks.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900 p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <ArrowRightLeft size={20} className="text-indigo-500" />{" "}
                      مهام محولة إلى {activeDept.name} ({incomingTasks.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {incomingTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          isIncoming={true}
                          onToggle={() => toggleStatus(task.id, task.status)}
                          onDelete={() => deleteTask(task.id)}
                          onForward={(target) => forwardTask(task, target)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <LayoutDashboard
                        size={20}
                        className={activeDept.primaryColor}
                      />{" "}
                      سجل مهام {activeDept.name}
                    </h3>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                      {myDeptTasks.length}
                    </span>
                  </div>
                  {myDeptTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-400 text-sm">
                        لا توجد مهام مطابقة للبحث.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myDeptTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={() => toggleStatus(task.id, task.status)}
                          onDelete={() => deleteTask(task.id)}
                          onForward={(target) => forwardTask(task, target)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
        <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-950 border-t dark:border-gray-800 py-3 text-center text-xs text-gray-500 dark:text-gray-400 z-40 shadow-inner">
          <p>© 2025 أحد مشروعات معوان @ جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}

function ChatComponent({
  user,
  db,
  departments,
  showToast,
  isOpen,
  setIsOpen,
  checkAdminAccess,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!isOpen || !isUnlocked) return;
    const q = query(
      collection(db, "chat_messages"),
      orderBy("createdAt", "asc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      msgs.forEach(async (msg) => {
        if (
          msg.senderEmail !== user.email &&
          (!msg.seenBy || !msg.seenBy.includes(user.displayName))
        ) {
          await updateDoc(doc(db, "chat_messages", msg.id), {
            seenBy: arrayUnion(user.displayName),
          });
        }
      });
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    });
    return () => unsubscribe();
  }, [isOpen, isUnlocked, db, user]);

  const handleUnlock = (e) => {
    e.preventDefault();
    const input = prompt("أدخل رمز الشات:");
    if (input === "1234566") setIsUnlocked(true);
    else showToast("رمز خاطئ", "error");
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "chat_messages"), {
      text: newMessage,
      sender: user.displayName,
      senderEmail: user.email,
      createdAt: Date.now(),
      type: "text",
      seenBy: [],
    });
    setNewMessage("");
  };
  const convertToTask = async (msg, targetDeptId) => {
    try {
      await addDoc(collection(db, "tasks"), {
        title: `مهمة من الشات: ${msg.text.substring(0, 30)}...`,
        details: `نص الرسالة: ${msg.text}\nمرسل الرسالة: ${msg.sender}`,
        deadline: "",
        priority: "normal",
        sourceDept: targetDeptId,
        forwardedTo: null,
        status: "pending",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        createdAtTimestamp: Date.now(),
        createdBy: user.email,
      });
      showToast(
        `تم التحويل إلى ${departments.find((d) => d.id === targetDeptId)?.name}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;
  if (!isUnlocked) {
    return (
      <div className="fixed bottom-20 right-6 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 text-center animate-fade-in-up border dark:border-gray-700">
        <Lock size={32} className="mx-auto text-indigo-500 mb-2" />
        <h3 className="font-bold dark:text-white mb-4">الشات محمي</h3>
        <button
          onClick={handleUnlock}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
        >
          أدخل الرمز
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-2 text-sm text-gray-400"
        >
          إغلاق
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] overflow-hidden animate-fade-in-up">
      <div className="bg-indigo-600 p-3 flex justify-between items-center text-white shadow-md">
        <h3 className="font-bold flex items-center gap-2">
          <MessageSquare size={18} /> دردشة الفريق
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.senderEmail === user.email ? "items-start" : "items-end"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm relative group ${
                msg.senderEmail === user.email
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-tl-none"
              }`}
            >
              <p className="text-[10px] opacity-70 mb-1 font-bold">
                {msg.sender}
              </p>
              {msg.text}
              <div className="flex justify-end mt-1 gap-1 text-[9px] opacity-70">
                {msg.seenBy && msg.seenBy.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Eye size={10} /> {msg.seenBy.length}
                  </span>
                )}
              </div>
              <div className="absolute top-1 left-[-30px] hidden group-hover:flex">
                <div className="relative group/menu">
                  <button
                    className="p-1 bg-gray-200 dark:bg-gray-600 rounded-full hover:text-indigo-600"
                    title="تحويل لمهمة"
                  >
                    <Forward size={14} />
                  </button>
                  <div className="absolute top-0 right-full mr-2 w-32 bg-white dark:bg-gray-800 shadow-xl rounded-lg border dark:border-gray-600 hidden group-hover/menu:block z-10">
                    {departments
                      .filter((d) => d.id !== "general")
                      .map((d) => (
                        <button
                          key={d.id}
                          onClick={() => convertToTask(msg, d.id)}
                          className="w-full text-right px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 block truncate"
                        >
                          {d.name}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex gap-2"
      >
        <button
          type="button"
          onClick={() => document.getElementById("emoji-trigger").click()}
          className="p-2 text-gray-500 hover:text-indigo-500"
        >
          <Smile size={20} />
        </button>
        <span id="emoji-trigger" className="hidden"></span>
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="اكتب رسالة..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function TaskCard({ task, isIncoming, onToggle, onDelete, onForward }) {
  const [showForwardMenu, setShowForwardMenu] = useState(false);

  const sourceDept =
    DEPARTMENTS.find((d) => d.id === task.sourceDept) || DEPARTMENTS[0];
  const targetDept = task.forwardedTo
    ? DEPARTMENTS.find((d) => d.id === task.forwardedTo)
    : null;
  const originalDeptId = isIncoming ? task.forwardedFrom : null;
  const originalDept = originalDeptId
    ? DEPARTMENTS.find((d) => d.id === originalDeptId)
    : null;

  const priorityConfig = PRIORITIES[task.priority] || PRIORITIES.normal;
  const PriorityIcon = priorityConfig.icon;

  const handleShare = async () => {
    const text = `مهمة: ${task.title}\nالتفاصيل: ${task.details}\nالموعد: ${task.deadline}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: task.title, text: text });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("تم نسخ تفاصيل المهمة!");
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 p-4 rounded-xl border transition-all hover:shadow-md ${
        isIncoming
          ? "border-indigo-100 dark:border-indigo-900/30 ring-1 ring-indigo-50 dark:ring-indigo-900/20"
          : "border-gray-100 dark:border-gray-700"
      } ${task.status === "completed" ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${priorityConfig.color} border`}
        >
          <PriorityIcon size={10} /> {priorityConfig.label}
        </div>
        <button
          onClick={handleShare}
          className="text-gray-400 hover:text-indigo-500"
        >
          <Share2 size={14} />
        </button>
      </div>
      <div className="flex gap-3 items-start">
        <button
          onClick={onToggle}
          className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.status === "completed"
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          <CheckCircle size={12} fill="currentColor" />
        </button>
        <div className="flex-1">
          <h4
            className={`font-bold text-gray-800 dark:text-white text-sm ${
              task.status === "completed"
                ? "line-through decoration-gray-400"
                : ""
            }`}
          >
            {task.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line leading-relaxed">
            {task.details}
          </p>
          <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
              <Calendar size={10} /> {task.deadline || "بلا موعد"}
            </span>
            {isIncoming && originalDept && (
              <span className="flex items-center gap-1 text-indigo-500">
                <ArrowRightLeft size={10} /> من {originalDept.name}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        {!isIncoming && (
          <div className="relative">
            <button
              onClick={() => setShowForwardMenu(!showForwardMenu)}
              className={`p-1.5 rounded transition ${
                task.forwardedTo
                  ? "text-green-500 bg-green-50 dark:bg-green-900/20"
                  : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              }`}
              title="تحويل"
            >
              <Forward size={14} />
            </button>
            {showForwardMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-xl border dark:border-gray-600 py-1 z-10 overflow-hidden">
                <p className="text-[10px] text-center text-gray-400 py-1 border-b dark:border-gray-600">
                  تحويل إلى:
                </p>
                {DEPARTMENTS.filter(
                  (d) => d.id !== task.sourceDept && d.id !== "general"
                ).map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      onForward(task, dept.id);
                      setShowForwardMenu(false);
                    }}
                    className="w-full text-right px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center gap-2"
                  >
                    <dept.icon size={12} /> {dept.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
