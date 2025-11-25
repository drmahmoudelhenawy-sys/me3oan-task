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
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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

  // ✅ إصلاح المشكلة: تحميل Tailwind هنا لضمان عمله في كل الشاشات
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
      if (!currentUser) {
        setIsCodeVerified(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 font-sans">
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!isCodeVerified) {
    return <SecretCodeScreen onSuccess={() => setIsCodeVerified(true)} />;
  }

  return <MainApp user={user} />;
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
            <div>
              <input
                type="password"
                className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="أدخل الكود هنا"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoFocus
              />
            </div>

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
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err.code === "auth/email-already-in-use") {
        setError("هذا البريد مستخدم بالفعل");
      } else if (err.code === "auth/weak-password") {
        setError("كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)");
      } else {
        setError("حدث خطأ: " + err.message);
      }
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
            className="w-20 h-20 mx-auto mb-4 bg-transparent p-1 object-contain filter brightness-0"
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
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isLogin ? (
              "دخول"
            ) : (
              "تسجيل"
            )}
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

  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isFirstLoad = useRef(true);

  const [newTask, setNewTask] = useState({
    title: "",
    details: "",
    deadline: "",
    priority: "normal",
  });
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [newMeeting, setNewMeeting] = useState({
    topic: "",
    date: "",
    time: "",
  });

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkAdminAccess = () => {
    const password = prompt("أدخل رمز المدير للإجراءات الحساسة:");
    if (password === "1234566") {
      return true;
    } else {
      showToast("رمز المرور خاطئ", "error");
      return false;
    }
  };

  const handleLogout = async () => {
    if (window.confirm("هل تريد تسجيل الخروج؟")) {
      await signOut(auth);
    }
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
    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        data.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
        setTasks(data);

        if (!isFirstLoad.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const newTask = change.doc.data();
              const deptName = DEPARTMENTS.find(
                (d) => d.id === newTask.sourceDept
              )?.name;

              const newNotif = {
                id: change.doc.id,
                text: `نشاط جديد في ${deptName}: ${newTask.title}`,
                time: new Date().toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
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
      },
      (error) => console.error("Tasks Error:", error)
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
      if (!snapshot.empty) {
        setManagementMeeting({
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        });
      } else {
        setManagementMeeting(null);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeEvents();
      unsubscribeMeeting();
    };
  }, []);

  const activeDept = DEPARTMENTS.find((d) => d.id === activeDeptId);

  const markNotificationsRead = () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu) {
      setUnreadCount(0);
    }
  };

  const handleSaveMeeting = async (e) => {
    e.preventDefault();
    if (!newMeeting.topic || !newMeeting.date || !newMeeting.time) {
      showToast("يرجى ملء البيانات", "error");
      return;
    }
    try {
      await addDoc(collection(db, "management_meetings"), {
        ...newMeeting,
        createdAt: Date.now(),
      });
      setNewMeeting({ topic: "", date: "", time: "" });
      setShowMeetingModal(false);
      showToast("تم نشر الاجتماع");
    } catch (err) {
      showToast("خطأ في النشر", "error");
    }
  };

  const clearMeeting = async () => {
    if (checkAdminAccess()) {
      if (managementMeeting && window.confirm("هل تريد إنهاء الإعلان؟")) {
        await deleteDoc(doc(db, "management_meetings", managementMeeting.id));
        showToast("تم إزالة الإعلان");
      }
    }
  };

  const openMeetingModal = () => {
    if (checkAdminAccess()) {
      setShowMeetingModal(true);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    let finalTitle = newTask.title;
    let finalDetails = newTask.details;

    if (activeDeptId === "educational") {
      if (eduType === "note") {
        if (!eduData.subjectName || !eduData.noteType || !eduData.batchNumber) {
          showToast("يرجى ملء بيانات المذكرة", "error");
          return;
        }
        finalTitle = `مذكرة: ${eduData.subjectName} - ${eduData.batchNumber}`;
        finalDetails = `النوع: ${eduData.noteType}\nملاحظات: ${newTask.details}`;
      } else {
        if (!eduData.requestType) {
          showToast("يرجى تحديد المطلوب", "error");
          return;
        }
        finalTitle = `سوشيال/أخرى: ${eduData.requestType}`;
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
        sourceDept: activeDeptId,
        forwardedTo: null,
        status: "pending",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        createdAtTimestamp: Date.now(),
        createdBy: user.email,
      });
      setNewTask({ title: "", details: "", deadline: "", priority: "normal" });
      setEduData({
        subjectName: "",
        noteType: "",
        batchNumber: "",
        requestType: "",
      });
      showToast("تمت إضافة المهمة بنجاح");
    } catch (err) {
      showToast(`خطأ: ${err.message}`, "error");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    try {
      await addDoc(collection(db, "events"), {
        title: newEvent.title,
        date: newEvent.date,
        deptId: activeDeptId,
        createdAt: Date.now(),
      });
      setNewEvent({ title: "", date: "" });
      showToast("تمت إضافة الحدث");
    } catch (err) {
      console.error(err);
    }
  };

  const forwardTask = async (originalTask, targetDeptId) => {
    try {
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
      };

      await addDoc(collection(db, "tasks"), newTaskData);

      const taskRef = doc(db, "tasks", originalTask.id);
      await updateDoc(taskRef, { forwardedTo: targetDeptId });

      const targetName = DEPARTMENTS.find((d) => d.id === targetDeptId)?.name;
      showToast(`تم إرسال نسخة إلى ${targetName}`);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ في التحويل", "error");
    }
  };

  const toggleStatus = async (taskId, currentStatus) => {
    await updateDoc(doc(db, "tasks", taskId), {
      status: currentStatus === "completed" ? "pending" : "completed",
    });
  };
  const deleteTask = async (taskId) => {
    if (window.confirm("حذف المهمة نهائياً؟")) {
      await deleteDoc(doc(db, "tasks", taskId));
      showToast("تم حذف المهمة", "error");
    }
  };
  const deleteEvent = async (eventId) => {
    if (window.confirm("حذف الحدث؟"))
      await deleteDoc(doc(db, "events", eventId));
  };

  const filterTasks = (taskList) => {
    return taskList.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ? true : t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

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

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 pb-20"
        dir="rtl"
      >
        {toast && (
          <div
            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl text-white font-bold text-sm flex items-center gap-2 animate-bounce ${
              toast.type === "error" ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} />
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
                  <Briefcase size={20} /> جدولة اجتماع إدارة
                </h3>
                <button onClick={() => setShowMeetingModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveMeeting} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    موضوع الاجتماع
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="مثال: اجتماع مديري الأقسام الشهري"
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
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={newMeeting.time}
                      onChange={(e) =>
                        setNewMeeting({ ...newMeeting, time: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  نشر الإعلان للجميع
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
                className="w-10 h-10 bg-transparent p-1 rounded object-contain filter brightness-0 invert"
              />
              <div>
                <h1 className="text-xl font-bold">معوان تاسك</h1>
                <p className="text-[10px] text-blue-200 max-w-md hidden md:block opacity-90 italic">
                  "{currentQuote}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <button
                  onClick={markNotificationsRead}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-900"></span>
                  )}
                </button>
                {showNotifMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        آخر النشاطات
                      </h4>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-center text-gray-400">
                        لا توجد إشعارات جديدة
                      </p>
                    ) : (
                      notifications.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-3 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">
                            {note.text}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 text-left">
                            {note.time}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={openMeetingModal}
                className="p-2 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-white transition border border-indigo-400/30"
                title="جدولة اجتماع إدارة"
              >
                <Briefcase size={18} />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-500/30 hover:bg-red-500/50 text-white transition"
                title="تسجيل الخروج"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto pb-0 no-scrollbar">
            {DEPARTMENTS.map((dept) => {
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

        <main className="max-w-7xl mx-auto px-4 py-6">
          {managementMeeting && (
            <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-1 text-white relative overflow-hidden animate-fade-in-down">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white text-indigo-600 p-3 rounded-full shadow-inner animate-pulse">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      📢 تنبيه إداري هام
                      <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full animate-bounce">
                        اجتماع
                      </span>
                    </h3>
                    <p className="text-indigo-100 mt-1">
                      {managementMeeting.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-black/20 px-6 py-2 rounded-lg">
                  <div className="text-center">
                    <span className="block text-xs text-indigo-200">
                      التاريخ
                    </span>
                    <span className="font-bold text-lg">
                      {managementMeeting.date}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/20"></div>
                  <div className="text-center">
                    <span className="block text-xs text-indigo-200">
                      الساعة
                    </span>
                    <span className="font-bold text-lg">
                      {managementMeeting.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={clearMeeting}
                  className="absolute top-2 left-2 text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <BarChart3 size={16} /> إحصائيات القسم
                  </h3>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {progress}%
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-1 opacity-90">
                  <span>مكتملة: {completedCount}</span>
                  <span>الكل: {totalCount}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Plus size={18} className={activeDept.primaryColor} /> تسجيل
                  مهمة جديدة
                </h3>
                <form onSubmit={handleAddTask} className="space-y-3">
                  {activeDeptId === "educational" && (
                    <div className="bg-blue-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm mb-2">
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setEduType("note")}
                          className={`flex-1 py-1 rounded ${
                            eduType === "note"
                              ? "bg-blue-600 text-white"
                              : "bg-white dark:bg-gray-600 dark:text-gray-300 text-gray-600"
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
                              : "bg-white dark:bg-gray-600 dark:text-gray-300 text-gray-600"
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
                  )}

                  {activeDeptId !== "educational" && (
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-900/50 p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <ArrowRightLeft size={20} className="text-indigo-500" />
                        مهام محولة إلى {activeDept.name} ({incomingTasks.length}
                        )
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
                        />
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
          </div>
        </main>

        <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-950 border-t dark:border-gray-800 py-3 text-center text-xs text-gray-500 dark:text-gray-400 z-40 shadow-inner">
          <p>© 2025 أحد مشروعات معوان @ جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}

function TaskCard({ task, isIncoming, onToggle, onDelete, onForward }) {
  const [showForwardMenu, setShowForwardMenu] = useState(false);

  const sourceDept =
    DEPARTMENTS.find((d) => d.id === task.sourceDept) || DEPARTMENTS[0];

  const originalDeptId = isIncoming ? task.forwardedFrom : null;
  const originalDept = originalDeptId
    ? DEPARTMENTS.find((d) => d.id === originalDeptId)
    : null;

  const targetDept = task.forwardedTo
    ? DEPARTMENTS.find((d) => d.id === task.forwardedTo)
    : null;

  const priorityConfig = PRIORITIES[task.priority] || PRIORITIES.normal;
  const PriorityIcon = priorityConfig.icon;

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

        {isIncoming && originalDept ? (
          <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-100 dark:border-indigo-800">
            <ArrowRightLeft size={10} /> وارد من {originalDept.name}
          </span>
        ) : (
          task.forwardedTo &&
          targetDept && (
            <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100 dark:border-green-900/50">
              <ArrowUpRight size={10} /> تم التحويل لـ {targetDept.name}
            </span>
          )
        )}
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
              title="تحويل إلى قسم آخر"
            >
              <Share2 size={14} />
            </button>

            {showForwardMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-xl border dark:border-gray-600 py-1 z-10 overflow-hidden">
                <p className="text-[10px] text-center text-gray-400 py-1 border-b dark:border-gray-600">
                  تحويل إلى:
                </p>
                {DEPARTMENTS.filter((d) => d.id !== task.sourceDept).map(
                  (dept) => (
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
                  )
                )}
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
