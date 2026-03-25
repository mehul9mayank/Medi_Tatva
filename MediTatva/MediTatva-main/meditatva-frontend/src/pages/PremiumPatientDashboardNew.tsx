import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useAppLanguage } from "@/contexts/LanguageContext";
import { 
  Home, MapPin, Search, ShoppingCart,
  LogOut, Brain, LifeBuoy, Camera, Phone
} from "lucide-react";
import { toast } from "sonner";

// Modular Components
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientProfile } from "@/components/patient/PatientProfile";
import { PatientSidebarMenu } from "@/components/patient/PatientSidebarMenu";
import { ConversationalScreening } from "@/components/patient/mental/ConversationalScreening";
import { CounselorHelpBookingSection } from "@/components/patient/mental/CounselorHelpBookingSection";

// Page Components
import { NearbyMedicalStoresPage } from "@/pages/NearbyMedicalStoresPage";
import { FindMedicineEnhanced } from "@/pages/FindMedicineEnhanced";
import { MedicineOrders } from "@/components/MedicineOrders";
import { PrescriptionScanner } from "@/components/PrescriptionScanner";
import { MoodAnalyzerPanel } from "@/components/patient/MoodAnalyzerPanel";
import { MediCallSarthi } from "@/components/MediCallSarthi";
import { Chatbot } from "@/components/Chatbot";

type Section = "home" | "call-saarthi" | "screening" | "counselor" | "nearby" | "find-medicine" | "orders" | "settings";

const PremiumPatientDashboardInner = () => {
  const navigate = useNavigate();
  const { t } = useAppLanguage();
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });
  const [showScanner, setShowScanner] = useState(false);
  const [showMoodAnalyzer, setShowMoodAnalyzer] = useState(false);
  const [showMediCallSarthi, setShowMediCallSarthi] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  // Ensure auth - redirect to login if not authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!isAuth || role !== "patient") {
      navigate("/login?role=patient", { replace: true });
    }
  }, [navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: "home" as Section, icon: Home, label: t("menu.dashboard", "Dashboard"), description: t("menu.dashboardDesc", "Wellness overview") },
    { id: "call-saarthi" as Section, icon: Phone, label: t("menu.callSaarthi", "Call Saarthi"), description: t("menu.callSaarthiDesc", "Voice and phone AI support") },
    { id: "screening" as Section, icon: Brain, label: t("menu.screening", "Mental Health Screening"), description: t("menu.screeningDesc", "PHQ-9 • GAD-7") },
    { id: "counselor" as Section, icon: LifeBuoy, label: t("menu.counselor", "Counselor / Help Booking"), description: t("menu.counselorDesc", "Escalate to human support") },
    { id: "nearby" as Section, icon: MapPin, label: t("menu.nearby", "Nearby Stores"), description: t("menu.nearbyDesc", "Find pharmacies") },
    { id: "find-medicine" as Section, icon: Search, label: t("menu.findMedicine", "Find Medicine"), description: t("menu.findMedicineDesc", "Search meds") },
    { id: "orders" as Section, icon: ShoppingCart, label: t("menu.orders", "My Orders"), description: t("menu.ordersDesc", "Track orders") },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    toast.success(t("actions.logout", "Logout") + " successful");
    navigate("/login");
  };

  const renderContent = () => {
    if (showScanner) {
      return (
        <div className="max-w-4xl mx-auto">
          <PrescriptionScanner isOpen={showScanner} onClose={() => setShowScanner(false)} />
        </div>
      );
    }

    const moodAnalyzerCard = (
      <div className="grid grid-cols-1 gap-6">
        <Card
          onClick={() => setShowMoodAnalyzer(true)}
          className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border-2 border-emerald-200 dark:border-emerald-700/20 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-fit p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-md">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Mood Anaylser</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Real-time facial expression and voice emotion analysis with confidence tracking</p>
          </div>
        </Card>
      </div>
    );

    const callSaarthiCard = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-100">Medi Call Saarthi</h4>
                  <p className="text-xs font-medium text-red-700/80 dark:text-red-300/80">Live AI Call Assistant</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">Most Direct</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Receive an AI-powered medical guidance call instantly with natural conversation support in Hindi and English.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="rounded-md bg-white border border-red-100 dark:bg-slate-900/50 dark:border-red-900/40 px-2.5 py-1.5">Instant callback</div>
              <div className="rounded-md bg-white border border-red-100 dark:bg-slate-900/50 dark:border-red-900/40 px-2.5 py-1.5">Bilingual support</div>
            </div>

            <Button onClick={() => setShowMediCallSarthi(true)} className="w-full h-11 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white">
              Start Call Saarthi
            </Button>
          </div>
        </Card>

        <Card className="p-6 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-100">AI Assistant</h4>
                  <p className="text-xs font-medium text-red-700/80 dark:text-red-300/80">Text Query Companion</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">Most Flexible</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Ask symptoms, medicine questions, and treatment options in text and get multilingual AI guidance with clear next steps.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="rounded-md bg-white border border-red-100 dark:bg-slate-900/50 dark:border-red-900/40 px-2.5 py-1.5">Multilingual answers</div>
              <div className="rounded-md bg-white border border-red-100 dark:bg-slate-900/50 dark:border-red-900/40 px-2.5 py-1.5">Medicine guidance</div>
            </div>

            <Button onClick={() => setShowChatbot(true)} className="w-full h-11 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white">
              Open AI Assistant
            </Button>
          </div>
        </Card>
      </div>
    );

    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-6">
            <Card className="border-cyan-200 dark:border-cyan-900/40 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-indigo-950/20">
              <CardHeader>
                <CardTitle className="text-2xl">{t("home.callDashboardTitle", "Mood Analyzer Dashboard")}</CardTitle>
                <CardDescription>
                  {t("home.callDashboardDesc", "Track real-time facial and voice emotion with confidence.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moodAnalyzerCard}
              </CardContent>
            </Card>
          </div>
        );
      case "call-saarthi":
        return (
          <Card className="border-cyan-200 dark:border-cyan-900/40 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 dark:from-cyan-950/20 dark:via-slate-900 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">{t("menu.callSaarthi", "Call Saarthi")}</CardTitle>
              <CardDescription>
                Start AI support through direct call or text-based assistant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {callSaarthiCard}
            </CardContent>
          </Card>
        );
      case "screening":
        return (
          <ConversationalScreening
            onOpenCounselor={() => setActiveSection("counselor")}
          />
        );
      case "counselor":
        return <CounselorHelpBookingSection />;
      case "nearby":
        return <NearbyMedicalStoresPage />;
      case "find-medicine":
        return <FindMedicineEnhanced />;
      case "orders":
        return <MedicineOrders />;
      case "settings":
        return <div className="text-center py-12 text-slate-600 dark:text-gray-500">Settings section</div>;
      default:
        return null;
    }
  };

  const isScreeningSection = activeSection === "screening";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <PatientHeader 
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-72 border-r border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto"
            >
              <PatientProfile />
              
              <div className="py-4">
                <PatientSidebarMenu
                  menuItems={menuItems}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  collapsed={false}
                />
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-slate-200 dark:border-gray-800">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("actions.logout", "Logout")}
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className={isScreeningSection ? "h-full p-0" : "container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={isScreeningSection ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isScreeningSection ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showMoodAnalyzer && <MoodAnalyzerPanel open={showMoodAnalyzer} onClose={() => setShowMoodAnalyzer(false)} />}
      {showMediCallSarthi && <MediCallSarthi onClose={() => setShowMediCallSarthi(false)} />}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
};

const PremiumPatientDashboard = () => (
  <ThemeProvider>
    <OrderProvider>
      <PremiumPatientDashboardInner />
    </OrderProvider>
  </ThemeProvider>
);

export default PremiumPatientDashboard;
