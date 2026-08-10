import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NavTab =
  | "landing"
  | "basic"
  | "learn"
  | "daily"
  | "techniques"
  | "journal"
  | "vision"
  | "dashboard"
  | "profile"
  | "mistakes"
  | "affirmations";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type RepeatFrequency = "NONE" | "DAILY" | "WEEKDAYS" | "WEEKLY" | "MONTHLY" | "CUSTOM";

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: "morning" | "afternoon" | "evening";
  priority?: TaskPriority;
  estimatedTime?: number; // minutes
  dueDate?: string;
  repeatFrequency?: RepeatFrequency;
  isPinned?: boolean;
  isArchived?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface AffirmationCategoryItem {
  id: string;
  name: string;
  sortOrder?: number;
}

export interface AffirmationItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  text: string;
  isFavorite: boolean;
  isTodayFeatured: boolean;
  tags: string[];
  audioUrl?: string;
  createdAt?: string;
}

export interface AffirmationAnalyticsData {
  totalRecitations: number;
  dailyRecitations: number;
  weeklyRecitations: number;
  longestStreak: number;
  currentStreak: number;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood?: string;
  imageUrl?: string;
}

export interface VisionCard {
  id: string;
  category: "Dream Home" | "Travel" | "Health" | "Relationships" | "Money";
  title: string;
  subtitle: string;
  imageUrl: string;
  progressPercentage?: number;
  isQuoteCard?: boolean;
}

export type VisionItemType = "IMAGE" | "TEXT" | "GOAL" | "AFFIRMATION" | "NOTE" | "LINK";
export type BoardLayoutMode = "FREEFORM" | "MASONRY";

export interface VisionBoardItemData {
  id: string;
  boardId: string;
  itemType: VisionItemType;
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  goalTarget?: number;
  goalProgress?: number;
  targetDate?: string;
  affirmationId?: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  zIndex: number;
  bgColor?: string;
  createdAt?: string;
}

export interface VisionBoardData {
  id: string;
  title: string;
  subtitle?: string;
  category: "Dream Home" | "Travel" | "Health" | "Relationships" | "Money" | "Career" | "Inner Peace";
  imageUrl?: string;
  layoutMode: BoardLayoutMode;
  isFavorite?: boolean;
  isArchived?: boolean;
  items: VisionBoardItemData[];
  createdAt?: string;
}

export interface FutureSelfProfile {
  primaryLocation: string;
  atmosphereVibes: string;
  morningDiscipline: string;
  wealthConsciousness: string;
  quote: string;
}

interface LuminaState {
  // Navigation & UI
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  dashboardView: "overview" | "analytics";
  setDashboardView: (view: "overview" | "analytics") => void;

  // Authentication State
  user: User | null;
  accessToken: string | null;
  isAuthModalOpen: boolean;
  authMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  setAuthData: (user: User | null, token: string | null) => void;
  // State Hydration & Purge Actions
  setDailyTasks: (tasks: DailyTask[]) => void;
  setCategories: (categories: AffirmationCategoryItem[]) => void;
  setAffirmations: (affirmations: AffirmationItem[]) => void;
  setAffirmationAnalytics: (analytics: AffirmationAnalyticsData) => void;
  setGratitudeEntries: (entries: GratitudeEntry[]) => void;
  deleteGratitudeEntry: (id: string) => void;
  setVisionBoards: (boards: VisionBoardData[]) => void;
  clearAllUserData: () => void;
  logout: () => void;

  // Daily Tasks (Feature 1)
  dailyTasks: DailyTask[];
  addTask: (task: Omit<DailyTask, "id"> & { id?: string }) => void;
  updateTask: (id: string, updates: Partial<DailyTask>) => void;
  toggleTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  deleteTask: (id: string) => void;
  pinTask: (id: string) => void;

  // Affirmations System (Feature 2)
  categories: AffirmationCategoryItem[];
  affirmations: AffirmationItem[];
  affirmationAnalytics: AffirmationAnalyticsData;
  activeCategory: string; // 'All' or categoryId
  setActiveCategory: (cat: string) => void;
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addAffirmation: (aff: Omit<AffirmationItem, "id"> & { id?: string }) => void;
  updateAffirmation: (id: string, updates: Partial<AffirmationItem>) => void;
  deleteAffirmation: (id: string) => void;
  toggleFavoriteAffirmation: (id: string) => void;
  setTodayFeaturedAffirmation: (id: string) => void;
  recordAffirmationRecitation: () => void;

  // Journal
  gratitudeEntries: GratitudeEntry[];
  addGratitudeEntry: (entry: Omit<GratitudeEntry, "id"> & { id?: string }) => void;

  // Vision Board
  visionCards: VisionCard[];
  addVisionCard: (card: Omit<VisionCard, "id">) => void;

  visionBoards: VisionBoardData[];
  activeBoardId: string | null;
  setActiveBoardId: (id: string | null) => void;
  addVisionBoard: (board: Omit<VisionBoardData, "id" | "items"> & { id?: string }) => void;
  updateVisionBoard: (id: string, updates: Partial<VisionBoardData>) => void;
  deleteVisionBoard: (id: string) => void;

  addVisionBoardItem: (item: Omit<VisionBoardItemData, "id"> & { id?: string }) => void;
  updateVisionBoardItem: (id: string, updates: Partial<VisionBoardItemData>) => void;
  deleteVisionBoardItem: (id: string) => void;

  // Future Self Profile
  futureSelfProfile: FutureSelfProfile;
  updateFutureSelfProfile: (profile: Partial<FutureSelfProfile>) => void;
  profileStep: number;
  setProfileStep: (step: number) => void;

  // Toast System
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useLuminaStore = create<LuminaState>()(
  persist(
    (set, get) => ({
      activeTab: "landing",
      setActiveTab: (tab) => set({ activeTab: tab }),

      dashboardView: "overview",
      setDashboardView: (view) => set({ dashboardView: view }),

      // Auth State Initializer
      user: null,
      accessToken: null,
      isAuthModalOpen: false,
      authMode: "login",
      openAuthModal: (mode = "login") =>
        set({ isAuthModalOpen: true, authMode: mode }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      setAuthData: (user, token) => set({ user, accessToken: token }),
      setDailyTasks: (dailyTasks) => set({ dailyTasks }),
      setCategories: (categories) => set({ categories }),
      setAffirmations: (affirmations) => set({ affirmations }),
      setAffirmationAnalytics: (affirmationAnalytics) => set({ affirmationAnalytics }),
      setGratitudeEntries: (gratitudeEntries) => set({ gratitudeEntries }),
      deleteGratitudeEntry: (id) =>
        set((state) => ({
          gratitudeEntries: state.gratitudeEntries.filter((g) => g.id !== id),
        })),
      setVisionBoards: (visionBoards) => set({ visionBoards, activeBoardId: visionBoards[0]?.id || null }),
      logout: () => get().clearAllUserData(),
      clearAllUserData: () => {
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("lumina-storage");
          } catch (e) {}
        }
        set({
          user: null,
          accessToken: null,
          dailyTasks: [],
          categories: [],
          affirmations: [],
          affirmationAnalytics: {
            totalRecitations: 0,
            dailyRecitations: 0,
            weeklyRecitations: 0,
            longestStreak: 0,
            currentStreak: 0,
          },
          gratitudeEntries: [],
          visionCards: [],
          visionBoards: [],
          activeBoardId: null,
          futureSelfProfile: {
            primaryLocation: "",
            atmosphereVibes: "",
            morningDiscipline: "",
            wealthConsciousness: "",
            quote: "",
          },
        });
      },

      // Daily Tasks (Feature 1)
      dailyTasks: [
        { id: "1", title: "Read Personal Goals & Identity Statement", completed: true, category: "morning", priority: "HIGH", isPinned: true, estimatedTime: 10 },
        { id: "2", title: "15-Minute Breathwork & Meditation", completed: true, category: "morning", priority: "HIGH", estimatedTime: 15 },
        { id: "3", title: "Hydration Goal (500ml Water with Lemon)", completed: true, category: "morning", priority: "LOW", estimatedTime: 5 },
        { id: "4", title: "Physical Exercise (45-Minute Flow or Strength)", completed: false, category: "afternoon", priority: "HIGH", estimatedTime: 45 },
        { id: "5", title: "Strategic Deep Work (No Distractions)", completed: false, category: "afternoon", priority: "HIGH", isPinned: true, estimatedTime: 90 },
        { id: "6", title: "Gratitude Reach-out (Send one kind note)", completed: false, category: "afternoon", priority: "MEDIUM", estimatedTime: 10 },
        { id: "7", title: "Review Day's Wins & Lessons", completed: false, category: "evening", priority: "MEDIUM", estimatedTime: 15 },
        { id: "8", title: "Guided Journaling Session", completed: false, category: "evening", priority: "HIGH", estimatedTime: 20 },
        { id: "9", title: "Digital Sunset (No Screens)", completed: false, category: "evening", priority: "MEDIUM", estimatedTime: 30 },
      ],
      addTask: (task) =>
        set((state) => ({
          dailyTasks: [
            ...state.dailyTasks,
            { ...task, id: task.id || `t_${Date.now()}`, isArchived: false, isPinned: false },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      toggleTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),
      archiveTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((t) =>
            t.id === id ? { ...t, isArchived: true } : t
          ),
        })),
      restoreTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((t) =>
            t.id === id ? { ...t, isArchived: false } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.filter((t) => t.id !== id),
        })),
      pinTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((t) =>
            t.id === id ? { ...t, isPinned: !t.isPinned } : t
          ),
        })),

      // Affirmations System (Feature 2)
      categories: [
        { id: "cat_1", name: "Confidence" },
        { id: "cat_2", name: "Money" },
        { id: "cat_3", name: "Health" },
        { id: "cat_4", name: "Career" },
        { id: "cat_5", name: "Study" },
        { id: "cat_6", name: "Business" },
        { id: "cat_7", name: "Relationships" },
      ],
      affirmations: [
        {
          id: "aff_1",
          categoryId: "cat_2",
          categoryName: "Money",
          text: "Money flows effortlessly toward me in expected and unexpected ways.",
          isFavorite: true,
          isTodayFeatured: true,
          tags: ["Abundance", "Mindset", "Success"],
        },
        {
          id: "aff_2",
          categoryId: "cat_2",
          categoryName: "Money",
          text: "I am a financial magnet for abundance, prosperity, and continuous wealth.",
          isFavorite: false,
          isTodayFeatured: false,
          tags: ["Abundance", "Wealth"],
        },
        {
          id: "aff_3",
          categoryId: "cat_1",
          categoryName: "Confidence",
          text: "I stand firmly in my truth, radiating calm confidence and magnetic authority.",
          isFavorite: true,
          isTodayFeatured: false,
          tags: ["Confidence", "Identity", "Power"],
        },
        {
          id: "aff_4",
          categoryId: "cat_3",
          categoryName: "Health",
          text: "Every cell in my body vibrates with vitality, energy, and radiant health.",
          isFavorite: false,
          isTodayFeatured: false,
          tags: ["Health", "Vitality"],
        },
        {
          id: "aff_5",
          categoryId: "cat_4",
          categoryName: "Career",
          text: "My high-value work transforms lives and creates profound professional leverage.",
          isFavorite: true,
          isTodayFeatured: false,
          tags: ["Career", "Success"],
        },
        {
          id: "aff_6",
          categoryId: "cat_5",
          categoryName: "Study",
          text: "My focus grows laser-sharp every single day, mastering complex knowledge effortlessly.",
          isFavorite: false,
          isTodayFeatured: false,
          tags: ["Study", "Exam", "Mindset"],
        },
      ],
      affirmationAnalytics: {
        totalRecitations: 42,
        dailyRecitations: 5,
        weeklyRecitations: 28,
        longestStreak: 14,
        currentStreak: 7,
      },
      activeCategory: "All",
      setActiveCategory: (cat) => set({ activeCategory: cat }),
      addCategory: (name) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { id: `cat_${Date.now()}`, name },
          ],
        })),
      renameCategory: (id, name) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          affirmations: state.affirmations.filter((a) => a.categoryId !== id),
        })),
      addAffirmation: (aff) =>
        set((state) => {
          const category = state.categories.find((c) => c.id === aff.categoryId);
          return {
            affirmations: [
              ...state.affirmations,
              {
                ...aff,
                id: aff.id || `aff_${Date.now()}`,
                categoryName: category ? category.name : "General",
              },
            ],
          };
        }),
      updateAffirmation: (id, updates) =>
        set((state) => ({
          affirmations: state.affirmations.map((a) => {
            if (a.id !== id) return a;
            const updatedCategory = updates.categoryId
              ? state.categories.find((c) => c.id === updates.categoryId)?.name
              : a.categoryName;
            return { ...a, ...updates, categoryName: updatedCategory };
          }),
        })),
      deleteAffirmation: (id) =>
        set((state) => ({
          affirmations: state.affirmations.filter((a) => a.id !== id),
        })),
      toggleFavoriteAffirmation: (id) =>
        set((state) => ({
          affirmations: state.affirmations.map((a) =>
            a.id === id ? { ...a, isFavorite: !a.isFavorite } : a
          ),
        })),
      setTodayFeaturedAffirmation: (id) =>
        set((state) => ({
          affirmations: state.affirmations.map((a) => ({
            ...a,
            isTodayFeatured: a.id === id,
          })),
        })),
      recordAffirmationRecitation: () =>
        set((state) => ({
          affirmationAnalytics: {
            ...state.affirmationAnalytics,
            totalRecitations: state.affirmationAnalytics.totalRecitations + 1,
            dailyRecitations: state.affirmationAnalytics.dailyRecitations + 1,
            weeklyRecitations: state.affirmationAnalytics.weeklyRecitations + 1,
          },
        })),

      // Journal
      gratitudeEntries: [
        {
          id: "g1",
          date: "October 23, 2026",
          title: "The Morning Mist",
          content:
            "Today I woke up early enough to see the mist clinging to the garden. There was a profound silence that felt like a hug. I'm grateful for the capacity to notice these small shifts in light...",
          tags: ["Nature", "Peace"],
          mood: "Calm 😊",
        },
        {
          id: "g2",
          date: "October 21, 2026",
          title: "A Shared Meal",
          content:
            "Dinner with Sarah tonight reminded me why community is so essential. We laughed until our sides ached over the most mundane things.",
          tags: ["Community", "Joy"],
          mood: "Peaceful 🕊️",
          imageUrl:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        },
      ],
      addGratitudeEntry: (entry) =>
        set((state) => ({
          gratitudeEntries: [
            { ...entry, id: entry.id || `g_${Date.now()}` },
            ...state.gratitudeEntries,
          ],
        })),

      // Legacy Vision Cards
      visionCards: [
        {
          id: "v0",
          category: "Health",
          title: "Energy flows where intention goes.",
          subtitle: "DAILY MANIFESTATION",
          imageUrl: "",
          isQuoteCard: true,
        },
        {
          id: "v1",
          category: "Health",
          title: "Vibrant Vitality",
          subtitle: "Morning discipline, lifelong strength.",
          imageUrl:
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
        },
      ],
      addVisionCard: (card) =>
        set((state) => ({
          visionCards: [...state.visionCards, { ...card, id: `v_${Date.now()}` }],
        })),

      // Vision Board System (Enhanced)
      visionBoards: [
        {
          id: "vb_1",
          title: "Dream Life & Sanctuary",
          subtitle: "Physical environment, freedom, and peaceful sanctuary.",
          category: "Dream Home",
          imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
          layoutMode: "FREEFORM",
          isFavorite: true,
          items: [
            {
              id: "item_1",
              boardId: "vb_1",
              itemType: "IMAGE",
              title: "Modern Architecture Studio",
              content: "High ceilings, natural timber, peaceful sunlight.",
              imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
              posX: 40,
              posY: 40,
              width: 320,
              height: 240,
              zIndex: 1,
            },
            {
              id: "item_2",
              boardId: "vb_1",
              itemType: "NOTE",
              title: "Daily Core Intention",
              content: "My environment reflects clarity, abundance, and effortless execution.",
              bgColor: "#47624d",
              posX: 380,
              posY: 40,
              width: 280,
              height: 180,
              zIndex: 2,
            },
            {
              id: "item_3",
              boardId: "vb_1",
              itemType: "GOAL",
              title: "Dream Sanctuary Fund",
              goalTarget: 500000,
              goalProgress: 65,
              posX: 380,
              posY: 240,
              width: 280,
              height: 160,
              zIndex: 3,
            },
          ],
        },
        {
          id: "vb_2",
          title: "Financial Freedom & Wealth",
          subtitle: "Wealth consciousness, investments, and scalable impact.",
          category: "Money",
          imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
          layoutMode: "FREEFORM",
          isFavorite: false,
          items: [
            {
              id: "item_4",
              boardId: "vb_2",
              itemType: "TEXT",
              title: "Financial Abundance Mindset",
              content: "Money flows toward me in expected and unexpected ways. I create massive value.",
              posX: 50,
              posY: 50,
              width: 340,
              height: 180,
              zIndex: 1,
            },
          ],
        },
      ],
      activeBoardId: "vb_1",
      setActiveBoardId: (id) => set({ activeBoardId: id }),

      addVisionBoard: (board) =>
        set((state) => {
          const newBoard: VisionBoardData = {
            ...board,
            id: board.id || `vb_${Date.now()}`,
            items: [],
          };
          return {
            visionBoards: [newBoard, ...state.visionBoards],
            activeBoardId: newBoard.id,
          };
        }),

      updateVisionBoard: (id, updates) =>
        set((state) => ({
          visionBoards: state.visionBoards.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      deleteVisionBoard: (id) =>
        set((state) => {
          const remaining = state.visionBoards.filter((b) => b.id !== id);
          return {
            visionBoards: remaining,
            activeBoardId: remaining[0]?.id || null,
          };
        }),

      addVisionBoardItem: (item) =>
        set((state) => ({
          visionBoards: state.visionBoards.map((b) => {
            if (b.id !== item.boardId) return b;
            const newItem: VisionBoardItemData = {
              ...item,
              id: item.id || `item_${Date.now()}`,
            };
            return {
              ...b,
              items: [...b.items, newItem],
            };
          }),
        })),

      updateVisionBoardItem: (id, updates) =>
        set((state) => ({
          visionBoards: state.visionBoards.map((b) => ({
            ...b,
            items: b.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          })),
        })),

      deleteVisionBoardItem: (id) =>
        set((state) => ({
          visionBoards: state.visionBoards.map((b) => ({
            ...b,
            items: b.items.filter((item) => item.id !== id),
          })),
        })),

      // Future Self Profile
      futureSelfProfile: {
        primaryLocation: "A sun-drenched villa in Tuscany",
        atmosphereVibes: "High ceilings, natural oak wood, morning breeze, aroma of fresh espresso.",
        morningDiscipline: "15-minute somatic movement, 10-minute breathwork.",
        wealthConsciousness: "$25,000 / Monthly",
        quote: "I am the architect of my life; I build its foundation and choose its contents.",
      },
      updateFutureSelfProfile: (profile) =>
        set((state) => ({
          futureSelfProfile: { ...state.futureSelfProfile, ...profile },
        })),
      profileStep: 1,
      setProfileStep: (step) => set({ profileStep: step }),

      toastMessage: null,
      showToast: (msg) => set({ toastMessage: msg }),
      clearToast: () => set({ toastMessage: null }),
    }),
    {
      name: "lumina-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        dailyTasks: state.dailyTasks,
        categories: state.categories,
        affirmations: state.affirmations,
        affirmationAnalytics: state.affirmationAnalytics,
        gratitudeEntries: state.gratitudeEntries,
        visionCards: state.visionCards,
        visionBoards: state.visionBoards,
        activeBoardId: state.activeBoardId,
        futureSelfProfile: state.futureSelfProfile,
      }),
    }
  )
);
