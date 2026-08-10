"use client";

import { useState, useRef, useEffect } from "react";
import {
  useLuminaStore,
  VisionBoardData,
  VisionBoardItemData,
  VisionItemType,
  BoardLayoutMode,
} from "@/store/useLuminaStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Sparkles,
  Image as ImageIcon,
  Layout,
  Grid,
  Maximize2,
  Minimize2,
  Trash2,
  Edit3,
  Heart,
  ExternalLink,
  Target,
  FileText,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Move,
  Layers,
  Upload,
  FolderPlus,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { apiService } from "@/services/api";

export default function VisionBoardView() {
  const {
    user,
    accessToken,
    openAuthModal,
    visionBoards,
    activeBoardId,
    setActiveBoardId,
    addVisionBoard,
    updateVisionBoard,
    deleteVisionBoard,
    addVisionBoardItem,
    updateVisionBoardItem,
    deleteVisionBoardItem,
    affirmations,
    showToast,
  } = useLuminaStore();

  const [layoutMode, setLayoutMode] = useState<BoardLayoutMode>("FREEFORM");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Modals
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VisionBoardItemData | null>(null);

  // Focus & Reflection Modes
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isReflectionModeOpen, setIsReflectionModeOpen] = useState(false);
  const [reflectionIndex, setReflectionIndex] = useState(0);

  // New Board Form State
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardSubtitle, setNewBoardSubtitle] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState<
    "Dream Home" | "Travel" | "Health" | "Relationships" | "Money" | "Career" | "Inner Peace"
  >("Dream Home");
  const [newBoardImageUrl, setNewBoardImageUrl] = useState("");

  // New Item Form State
  const [itemType, setItemType] = useState<VisionItemType>("IMAGE");
  const [itemTitle, setItemTitle] = useState("");
  const [itemContent, setItemContent] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemLinkUrl, setItemLinkUrl] = useState("");
  const [itemGoalTarget, setItemGoalTarget] = useState<number>(10000);
  const [itemGoalProgress, setItemGoalProgress] = useState<number>(50);
  const [itemAffirmationId, setItemAffirmationId] = useState("");
  const [itemBgColor, setItemBgColor] = useState("#47624d");

  // Dragging State for Freeform Canvas
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get active board
  const activeBoard = visionBoards.find((b) => b.id === activeBoardId) || visionBoards[0];
  const items = activeBoard ? activeBoard.items : [];

  // Authentication check helper
  const requireAuth = (actionName: string = "perform this action") => {
    if (!user) {
      showToast(`Please login to ${actionName}`);
      openAuthModal("login");
      return false;
    }
    return true;
  };

  // Sync active board layout mode
  useEffect(() => {
    if (activeBoard?.layoutMode) {
      setLayoutMode(activeBoard.layoutMode);
    }
  }, [activeBoard?.id, activeBoard?.layoutMode]);

  // Handle Drag Start
  const handleMouseDownItem = (
    e: React.MouseEvent,
    item: VisionBoardItemData
  ) => {
    if (layoutMode !== "FREEFORM") return;
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      return;
    }
    e.preventDefault();
    setDraggingItemId(item.id);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDragOffset({
      x: e.clientX - canvasRect.left - item.posX,
      y: e.clientY - canvasRect.top - item.posY,
    });

    // Bring to front
    const maxZ = Math.max(...items.map((i) => i.zIndex || 1), 1);
    if (item.zIndex <= maxZ) {
      updateVisionBoardItem(item.id, { zIndex: maxZ + 1 });
    }
  };

  // Handle Drag Move & End
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingItemId || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(canvasRect.width - 200, e.clientX - canvasRect.left - dragOffset.x));
      const newY = Math.max(0, Math.min(2000, e.clientY - canvasRect.top - dragOffset.y));

      updateVisionBoardItem(draggingItemId, { posX: newX, posY: newY });
    };

    const handleMouseUp = async () => {
      if (draggingItemId) {
        const item = items.find((i) => i.id === draggingItemId);
        if (item && accessToken) {
          try {
            await apiService.updateVisionItem(accessToken, item.id, {
              posX: item.posX,
              posY: item.posY,
            });
          } catch (err) {
            console.error("Failed to sync item position to backend:", err);
          }
        }
        setDraggingItemId(null);
      }
    };

    if (draggingItemId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingItemId, dragOffset, updateVisionBoardItem, items, accessToken]);

  // Handle Create Board
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("create vision boards")) return;
    if (!newBoardTitle.trim()) return;

    if (accessToken) {
      try {
        const created = await apiService.createVisionBoard(accessToken, {
          title: newBoardTitle,
          subtitle: newBoardSubtitle || "Anchored vision board.",
          category: newBoardCategory,
          imageUrl:
            newBoardImageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          layoutMode: "FREEFORM",
        });
        addVisionBoard({
          id: created.id,
          title: created.title,
          subtitle: created.subtitle,
          category: created.category,
          imageUrl: created.imageUrl,
          layoutMode: created.layoutMode || "FREEFORM",
          isFavorite: created.isFavorite || false,
        });
        setActiveBoardId(created.id);
      } catch (err) {
        console.error("Failed to create vision board via API:", err);
        addVisionBoard({
          title: newBoardTitle,
          subtitle: newBoardSubtitle || "Anchored vision board.",
          category: newBoardCategory,
          imageUrl:
            newBoardImageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          layoutMode: "FREEFORM",
          isFavorite: false,
        });
      }
    } else {
      addVisionBoard({
        title: newBoardTitle,
        subtitle: newBoardSubtitle || "Anchored vision board.",
        category: newBoardCategory,
        imageUrl:
          newBoardImageUrl ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        layoutMode: "FREEFORM",
        isFavorite: false,
      });
    }

    setNewBoardTitle("");
    setNewBoardSubtitle("");
    setNewBoardImageUrl("");
    setIsAddBoardModalOpen(false);
    showToast("Vision Board created");

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Image File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);
          setItemImageUrl(compressedBase64);
        } else {
          setItemImageUrl(rawDataUrl);
        }
      };
      img.onerror = () => setItemImageUrl(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Open Add / Edit Item Modal
  const openAddItemModal = (itemToEdit?: VisionBoardItemData) => {
    if (!requireAuth("add vision items")) return;
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setItemType(itemToEdit.itemType);
      setItemTitle(itemToEdit.title || "");
      setItemContent(itemToEdit.content || "");
      setItemImageUrl(itemToEdit.imageUrl || "");
      setItemLinkUrl(itemToEdit.linkUrl || "");
      setItemGoalTarget(itemToEdit.goalTarget || 10000);
      setItemGoalProgress(itemToEdit.goalProgress || 50);
      setItemAffirmationId(itemToEdit.affirmationId || "");
      setItemBgColor(itemToEdit.bgColor || "#47624d");
    } else {
      setEditingItem(null);
      setItemType("IMAGE");
      setItemTitle("");
      setItemContent("");
      setItemImageUrl("");
      setItemLinkUrl("");
      setItemGoalTarget(10000);
      setItemGoalProgress(50);
      setItemAffirmationId("");
      setItemBgColor("#47624d");
    }
    setIsAddItemModalOpen(true);
  };

  // Handle Save Item
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth("save vision items")) return;
    if (!activeBoard) return;

    if (editingItem) {
      if (accessToken) {
        try {
          await apiService.updateVisionItem(accessToken, editingItem.id, {
            itemType,
            title: itemTitle,
            content: itemContent,
            imageUrl: itemImageUrl,
            linkUrl: itemLinkUrl,
            goalTarget: itemGoalTarget,
            goalProgress: itemGoalProgress,
            affirmationId: itemAffirmationId,
            bgColor: itemBgColor,
          });
        } catch (err) {
          console.error("Failed to update vision item via API:", err);
        }
      }
      updateVisionBoardItem(editingItem.id, {
        itemType,
        title: itemTitle,
        content: itemContent,
        imageUrl: itemImageUrl,
        linkUrl: itemLinkUrl,
        goalTarget: itemGoalTarget,
        goalProgress: itemGoalProgress,
        affirmationId: itemAffirmationId,
        bgColor: itemBgColor,
      });
      showToast("Vision item updated");
    } else {
      const defaultImg =
        itemImageUrl ||
        (itemType === "IMAGE"
          ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
          : "");
      const initialX = Math.floor(Math.random() * 150) + 30;
      const initialY = Math.floor(Math.random() * 150) + 30;

      if (accessToken) {
        try {
          const created = await apiService.createVisionItem(accessToken, {
            boardId: activeBoard.id,
            itemType,
            title: itemTitle,
            content: itemContent,
            imageUrl: defaultImg,
            linkUrl: itemLinkUrl,
            goalTarget: itemGoalTarget,
            goalProgress: itemGoalProgress,
            affirmationId: itemAffirmationId,
            posX: initialX,
            posY: initialY,
            width: itemType === "TEXT" || itemType === "NOTE" ? 280 : 320,
            height: 240,
            zIndex: items.length + 1,
            bgColor: itemBgColor,
          });
          addVisionBoardItem({
            id: created.id,
            boardId: created.boardId || activeBoard.id,
            itemType: created.itemType || itemType,
            title: created.title || itemTitle,
            content: created.content || itemContent,
            imageUrl: created.imageUrl || defaultImg,
            linkUrl: created.linkUrl || itemLinkUrl,
            goalTarget: created.goalTarget || itemGoalTarget,
            goalProgress: created.goalProgress || itemGoalProgress,
            affirmationId: created.affirmationId || itemAffirmationId,
            posX: created.posX ?? initialX,
            posY: created.posY ?? initialY,
            width: created.width || (itemType === "TEXT" || itemType === "NOTE" ? 280 : 320),
            height: created.height || 240,
            zIndex: created.zIndex || items.length + 1,
            bgColor: created.bgColor || itemBgColor,
          });
        } catch (err) {
          console.error("Failed to create vision item via API:", err);
          addVisionBoardItem({
            boardId: activeBoard.id,
            itemType,
            title: itemTitle,
            content: itemContent,
            imageUrl: defaultImg,
            linkUrl: itemLinkUrl,
            goalTarget: itemGoalTarget,
            goalProgress: itemGoalProgress,
            affirmationId: itemAffirmationId,
            posX: initialX,
            posY: initialY,
            width: itemType === "TEXT" || itemType === "NOTE" ? 280 : 320,
            height: 240,
            zIndex: items.length + 1,
            bgColor: itemBgColor,
          });
        }
      } else {
        addVisionBoardItem({
          boardId: activeBoard.id,
          itemType,
          title: itemTitle,
          content: itemContent,
          imageUrl: defaultImg,
          linkUrl: itemLinkUrl,
          goalTarget: itemGoalTarget,
          goalProgress: itemGoalProgress,
          affirmationId: itemAffirmationId,
          posX: initialX,
          posY: initialY,
          width: itemType === "TEXT" || itemType === "NOTE" ? 280 : 320,
          height: 240,
          zIndex: items.length + 1,
          bgColor: itemBgColor,
        });
      }
      showToast("Vision item anchored to canvas");
      confetti({ particleCount: 20, spread: 50 });
    }

    setIsAddItemModalOpen(false);
  };

  // Delete Board & Delete Item Handlers
  const handleDeleteBoard = async () => {
    if (!requireAuth("delete board")) return;
    if (!activeBoard) return;
    if (visionBoards.length <= 1) {
      showToast("Cannot delete your only vision board");
      return;
    }
    if (confirm(`Are you sure you want to delete board "${activeBoard.title}"?`)) {
      if (accessToken) {
        try {
          await apiService.deleteVisionBoard(accessToken, activeBoard.id);
        } catch (err) {
          console.error("Failed to delete vision board via API:", err);
        }
      }
      deleteVisionBoard(activeBoard.id);
      showToast("Vision board deleted");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!requireAuth("delete vision item")) return;
    if (accessToken) {
      try {
        await apiService.deleteVisionItem(accessToken, itemId);
      } catch (err) {
        console.error("Failed to delete vision item via API:", err);
      }
    }
    deleteVisionBoardItem(itemId);
    showToast("Item deleted");
  };

  // Open Reflection Mode
  const openReflectionMode = () => {
    if (items.length === 0) {
      showToast("Add items to your vision board before reflecting");
      return;
    }
    setReflectionIndex(0);
    setIsReflectionModeOpen(true);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#e4e2e1] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#745b25]">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Manifestation Canvas
            </span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1b1c1c]">
            Vision Board & Intentions
          </h1>
          <p className="text-sm text-[#615b51]">
            Anchor your subconscious desires in physical visualization. Drag, arrange, and reflect.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddBoardModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#c2c8c0] text-[#1b1c1c] text-xs font-semibold hover:bg-[#f6f3f2] transition-all flex items-center gap-2 shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-[#47624d]" />
            <span>New Board</span>
          </button>

          <button
            onClick={openReflectionMode}
            className="px-4 py-2.5 rounded-2xl bg-[#745b25] hover:bg-[#5f491c] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
          >
            <Play className="w-4 h-4 text-[#ffdb99]" />
            <span>Reflection Mode</span>
          </button>

          <button
            onClick={() => setIsFocusModeOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#1b1c1c] hover:bg-black text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
          >
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={() => openAddItemModal()}
            className="px-5 py-2.5 rounded-2xl bg-[#47624d] hover:bg-[#38503d] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* BOARD SELECTOR & LAYOUT CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#e4e2e1] shadow-xs">
        {/* BOARDS TABS */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {visionBoards.map((b) => {
            const isActive = b.id === activeBoard?.id;
            return (
              <button
                key={b.id}
                onClick={() => setActiveBoardId(b.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isActive
                    ? "bg-[#47624d] text-white border-[#47624d] shadow-xs"
                    : "bg-[#f6f3f2] text-[#424842] border-[#e4e2e1] hover:bg-[#e8e4e3]"
                }`}
              >
                <span>{b.title}</span>
                <span className="text-[10px] opacity-75">({b.items.length})</span>
              </button>
            );
          })}
        </div>

        {/* LAYOUT TOGGLE & BOARD ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#f6f3f2] p-1 rounded-2xl border border-[#e4e2e1]">
            <button
              onClick={() => {
                setLayoutMode("FREEFORM");
                if (activeBoard) updateVisionBoard(activeBoard.id, { layoutMode: "FREEFORM" });
              }}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === "FREEFORM"
                  ? "bg-white text-[#1b1c1c] shadow-xs font-bold"
                  : "text-[#737972] hover:text-[#1b1c1c]"
              }`}
              title="Freeform Drag Canvas"
            >
              <Layout className="w-4 h-4" />
              <span className="hidden md:inline">Freeform</span>
            </button>

            <button
              onClick={() => {
                setLayoutMode("MASONRY");
                if (activeBoard) updateVisionBoard(activeBoard.id, { layoutMode: "MASONRY" });
              }}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                layoutMode === "MASONRY"
                  ? "bg-white text-[#1b1c1c] shadow-xs font-bold"
                  : "text-[#737972] hover:text-[#1b1c1c]"
              }`}
              title="Masonry Grid"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          {activeBoard && (
            <button
              onClick={handleDeleteBoard}
              className="p-2.5 rounded-2xl text-[#737972] hover:text-rose-600 hover:bg-rose-50 border border-[#e4e2e1] transition-all"
              title="Delete Active Board"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE BOARD BANNER */}
      {activeBoard && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-[#745b25]/10 text-[#745b25] px-2.5 py-0.5 rounded-full font-bold">
              {activeBoard.category}
            </span>
            {activeBoard.isFavorite && (
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            )}
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
            {activeBoard.title}
          </h2>
          {activeBoard.subtitle && (
            <p className="text-xs text-[#615b51]">{activeBoard.subtitle}</p>
          )}
        </div>
      )}

      {/* CANVAS CONTAINER */}
      <div
        ref={canvasRef}
        className={`relative w-full rounded-3xl border border-[#e4e2e1] bg-[#fbf9f8] p-6 min-h-[600px] overflow-auto shadow-inner ${
          layoutMode === "FREEFORM" ? "cursor-crosshair" : ""
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle, #e4e2e1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
            <Sparkles className="w-12 h-12 text-[#745b25] opacity-40 animate-pulse" />
            <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
              Your Canvas is Empty
            </h3>
            <p className="text-xs text-[#615b51] max-w-sm">
              Add images, quotes, financial goals, sticky notes, or linked affirmations to bring your vision board to life.
            </p>
            <button
              onClick={() => openAddItemModal()}
              className="px-6 py-3 rounded-2xl bg-[#47624d] text-white text-xs font-semibold flex items-center gap-2 shadow-md hover:bg-[#38503d]"
            >
              <Plus className="w-4 h-4" /> Add First Vision Item
            </button>
          </div>
        ) : layoutMode === "FREEFORM" ? (
          /* FREEFORM DRAG & DROP CANVAS */
          <div
            className="relative w-full min-w-[700px]"
            style={{
              minHeight: `${Math.max(
                650,
                ...items.map((i) => (i.posY || 0) + (i.height || 260) + 60)
              )}px`,
            }}
          >
            {items.map((item) => {
              const isSelected = draggingItemId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => handleMouseDownItem(e, item)}
                  style={{
                    position: "absolute",
                    left: `${item.posX}px`,
                    top: `${item.posY}px`,
                    width: `${item.width}px`,
                    zIndex: item.zIndex || 1,
                  }}
                  className={`group rounded-3xl transition-shadow select-none ${
                    isSelected ? "shadow-2xl ring-2 ring-[#47624d]" : "shadow-md hover:shadow-xl"
                  }`}
                >
                  <VisionItemCard
                    item={item}
                    onEdit={() => openAddItemModal(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                    affirmations={affirmations}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* MASONRY GRID LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="shadow-md hover:shadow-xl rounded-3xl transition-all">
                <VisionItemCard
                  item={item}
                  onEdit={() => openAddItemModal(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                  affirmations={affirmations}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE NEW BOARD MODAL */}
      <AnimatePresence>
        {isAddBoardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1]"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  Create Vision Board
                </h3>
                <button
                  onClick={() => setIsAddBoardModalOpen(false)}
                  className="p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBoard} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Board Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream House 2027"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Subtitle / Vision Intention
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oceanside sanctuary with private studio"
                    value={newBoardSubtitle}
                    onChange={(e) => setNewBoardSubtitle(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={newBoardCategory}
                    onChange={(e) => setNewBoardCategory(e.target.value as any)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  >
                    <option>Dream Home</option>
                    <option>Travel</option>
                    <option>Health</option>
                    <option>Relationships</option>
                    <option>Money</option>
                    <option>Career</option>
                    <option>Inner Peace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newBoardImageUrl}
                    onChange={(e) => setNewBoardImageUrl(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setIsAddBoardModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl border border-[#c2c8c0] text-[#1b1c1c] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#47624d] text-white font-medium hover:bg-[#38503d]"
                  >
                    Create Board
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT ITEM MODAL */}
      <AnimatePresence>
        {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#e4e2e1] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#f0eded] pb-4">
                <h3 className="font-serif-title text-2xl font-bold text-[#1b1c1c]">
                  {editingItem ? "Edit Vision Item" : "Add Vision Item"}
                </h3>
                <button
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="p-2 text-[#737972] hover:text-[#1b1c1c] rounded-full hover:bg-[#f6f3f2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                {/* ITEM TYPE SELECTION */}
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Item Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: "IMAGE", label: "Image", icon: ImageIcon },
                        { id: "TEXT", label: "Quote/Text", icon: FileText },
                        { id: "GOAL", label: "Goal Card", icon: Target },
                        { id: "NOTE", label: "Sticky Note", icon: Bookmark },
                        { id: "AFFIRMATION", label: "Affirmation", icon: Sparkles },
                        { id: "LINK", label: "Link", icon: ExternalLink },
                      ] as const
                    ).map((t) => {
                      const Icon = t.icon;
                      const isSelected = itemType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setItemType(t.id)}
                          className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-[#47624d] text-white border-[#47624d] shadow-sm font-semibold"
                              : "bg-[#f6f3f2] text-[#424842] border-[#e4e2e1] hover:bg-[#e8e4e3]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px]">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC FORM FIELDS DEPENDING ON ITEM TYPE */}
                <div>
                  <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                    Title / Heading
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco Penthouse"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                  />
                </div>

                {(itemType === "IMAGE" || itemType === "LINK") && (
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                      Image URL or Upload File
                    </label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={itemImageUrl}
                        onChange={(e) => setItemImageUrl(e.target.value)}
                        className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-[#f6f3f2] hover:bg-[#e8e4e3] border border-[#e4e2e1] rounded-2xl text-[#1b1c1c] font-semibold flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#47624d]" />
                          <span>Upload Local Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {(itemType === "TEXT" || itemType === "NOTE" || itemType === "IMAGE") && (
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                      Caption / Content / Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter details, quotes, or subconscious intentions..."
                      value={itemContent}
                      onChange={(e) => setItemContent(e.target.value)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1] focus:border-[#47624d] focus:outline-none font-serif-title"
                    />
                  </div>
                )}

                {itemType === "GOAL" && (
                  <div className="space-y-3 bg-[#f6f3f2] p-4 rounded-2xl border border-[#e4e2e1]">
                    <div>
                      <label className="block text-[#1b1c1c] font-semibold mb-1">
                        Goal Target Value ($ / Amount)
                      </label>
                      <input
                        type="number"
                        value={itemGoalTarget}
                        onChange={(e) => setItemGoalTarget(Number(e.target.value))}
                        className="w-full bg-white text-[#1b1c1c] p-2.5 rounded-xl border border-[#e4e2e1]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1b1c1c] font-semibold mb-1">
                        Current Alignment Progress ({itemGoalProgress}%)
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={itemGoalProgress}
                        onChange={(e) => setItemGoalProgress(Number(e.target.value))}
                        className="w-full accent-[#47624d]"
                      />
                    </div>
                  </div>
                )}

                {itemType === "AFFIRMATION" && (
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                      Link Existing Affirmation
                    </label>
                    <select
                      value={itemAffirmationId}
                      onChange={(e) => {
                        setItemAffirmationId(e.target.value);
                        const aff = affirmations.find((a) => a.id === e.target.value);
                        if (aff) {
                          setItemTitle(aff.categoryName || "Affirmation");
                          setItemContent(aff.text);
                        }
                      }}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1]"
                    >
                      <option value="">Select Affirmation...</option>
                      {affirmations.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.text.substring(0, 50)}...
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {itemType === "LINK" && (
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                      Inspiration URL *
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={itemLinkUrl}
                      onChange={(e) => setItemLinkUrl(e.target.value)}
                      className="w-full bg-[#f6f3f2] text-[#1b1c1c] p-3 rounded-2xl border border-[#e4e2e1]"
                    />
                  </div>
                )}

                {(itemType === "NOTE" || itemType === "TEXT") && (
                  <div>
                    <label className="block text-[#1b1c1c] font-semibold mb-1 uppercase tracking-wider">
                      Card Theme Color
                    </label>
                    <div className="flex items-center gap-3">
                      {[
                        { color: "#47624d", label: "Emerald" },
                        { color: "#745b25", label: "Gold" },
                        { color: "#1b1c1c", label: "Dark" },
                        { color: "#8b4513", label: "Amber" },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setItemBgColor(c.color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            itemBgColor === c.color ? "scale-110 border-white ring-2 ring-black" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setIsAddItemModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl border border-[#c2c8c0] text-[#1b1c1c] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#47624d] text-white font-medium hover:bg-[#38503d]"
                  >
                    {editingItem ? "Save Changes" : "Anchor to Canvas"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN FOCUS MODE */}
      <AnimatePresence>
        {isFocusModeOpen && activeBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0d0f0e] text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#ffdb99] tracking-widest bg-white/10 px-3 py-1 rounded-full">
                  {activeBoard.category} Focus Mode
                </span>
                <h2 className="font-serif-title text-3xl font-bold mt-2">
                  {activeBoard.title}
                </h2>
              </div>
              <button
                onClick={() => setIsFocusModeOpen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Minimize2 className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-auto py-8 max-w-6xl mx-auto w-full">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 p-6 space-y-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Vision"}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                  )}
                  {item.title && (
                    <h3 className="font-serif-title text-xl font-bold text-emerald-100">
                      {item.title}
                    </h3>
                  )}
                  {item.content && (
                    <p className="text-sm text-gray-300 font-serif leading-relaxed">
                      &quot;{item.content}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-white/40">
              Immerse your mind in physical clarity. Subconscious focus precedes outcome.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN REFLECTION MODE */}
      <AnimatePresence>
        {isReflectionModeOpen && items[reflectionIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121413] text-white flex flex-col justify-between p-6 sm:p-12 select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#ffdb99] tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Reflection Step {reflectionIndex + 1} of {items.length}
              </span>
              <button
                onClick={() => setIsReflectionModeOpen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-8 my-auto px-4">
              <motion.div
                key={items[reflectionIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {items[reflectionIndex].imageUrl && (
                  <img
                    src={items[reflectionIndex].imageUrl}
                    alt={items[reflectionIndex].title || "Reflection"}
                    className="max-h-[350px] w-auto mx-auto object-cover rounded-3xl shadow-2xl border border-white/20"
                  />
                )}
                {items[reflectionIndex].title && (
                  <h3 className="font-serif-title text-3xl sm:text-4xl font-bold text-emerald-50">
                    {items[reflectionIndex].title}
                  </h3>
                )}
                {items[reflectionIndex].content && (
                  <p className="font-serif-title text-xl sm:text-2xl italic text-gray-200 leading-relaxed max-w-xl mx-auto">
                    &quot;{items[reflectionIndex].content}&quot;
                  </p>
                )}
              </motion.div>
            </div>

            <div className="flex items-center justify-between max-w-md mx-auto w-full">
              <button
                onClick={() =>
                  setReflectionIndex((prev) => (prev - 1 + items.length) % items.length)
                }
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => {
                  confetti({ particleCount: 25, spread: 50 });
                  showToast("Vision Intention Anchored (+1)");
                }}
                className="px-6 py-3 rounded-full bg-[#47624d] text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#ffdb99]" />
                <span>Embody Vision</span>
              </button>

              <button
                onClick={() =>
                  setReflectionIndex((prev) => (prev + 1) % items.length)
                }
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// COMPONENT: INDIVIDUAL VISION ITEM CARD
function VisionItemCard({
  item,
  onEdit,
  onDelete,
  affirmations,
}: {
  item: VisionBoardItemData;
  onEdit: () => void;
  onDelete: () => void;
  affirmations: any[];
}) {
  if (item.itemType === "NOTE") {
    return (
      <div
        style={{ backgroundColor: item.bgColor || "#47624d" }}
        className="text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 relative min-h-[180px]"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#ffdb99]">
            <span className="font-mono uppercase text-[10px] tracking-wider">Intention Note</span>
            <div className="flex items-center gap-1">
              <button onClick={onEdit} className="p-1 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={onDelete} className="p-1 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {item.title && <h4 className="font-serif-title text-xl font-bold">{item.title}</h4>}
          {item.content && <p className="text-xs leading-relaxed opacity-90">{item.content}</p>}
        </div>
      </div>
    );
  }

  if (item.itemType === "GOAL") {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-ambient border border-[#e4e2e1] flex flex-col justify-between space-y-4 min-h-[180px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ffdb99]/30 text-[#745b25] px-2.5 py-0.5 rounded-full">
              Goal Alignment
            </span>
            <div className="flex items-center gap-1 text-[#737972]">
              <button onClick={onEdit} className="p-1 hover:text-[#1b1c1c]"><Edit3 className="w-3.5 h-3.5" /></button>
              <button onClick={onDelete} className="p-1 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <h4 className="font-serif-title text-xl font-bold text-[#1b1c1c]">{item.title || "Target Goal"}</h4>
          {item.goalTarget && (
            <p className="text-xs text-[#615b51]">Target: ${item.goalTarget.toLocaleString()}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#737972]">Progress</span>
            <span className="text-[#47624d]">{item.goalProgress || 0}%</span>
          </div>
          <div className="h-2.5 w-full bg-[#f6f3f2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#47624d] rounded-full transition-all duration-500"
              style={{ width: `${item.goalProgress || 0}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (item.itemType === "AFFIRMATION") {
    const aff = affirmations.find((a) => a.id === item.affirmationId);
    return (
      <div className="bg-gradient-to-br from-[#745b25] to-[#5a461b] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 min-h-[180px]">
        <div className="flex items-center justify-between text-xs text-[#ffdb99]">
          <span className="font-mono uppercase text-[10px] tracking-wider">Linked Affirmation</span>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-1 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
            <button onClick={onDelete} className="p-1 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <p className="font-serif-title text-lg font-medium italic leading-relaxed">
          &quot;{aff ? aff.text : item.content || item.title}&quot;
        </p>
      </div>
    );
  }

  if (item.itemType === "TEXT") {
    return (
      <div className="bg-[#1b1c1c] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 min-h-[180px]">
        <div className="flex items-center justify-between text-xs text-[#ffdb99]">
          <span className="font-mono uppercase text-[10px] tracking-wider">Quote Card</span>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-1 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
            <button onClick={onDelete} className="p-1 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <h4 className="font-serif-title text-2xl font-bold leading-tight">&quot;{item.title}&quot;</h4>
        {item.content && <p className="text-xs text-gray-300 font-serif">{item.content}</p>}
      </div>
    );
  }

  // DEFAULT / IMAGE TYPE
  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-ambient min-h-[220px] flex flex-col justify-end bg-black">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title || "Vision"}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* TOP CONTROLS */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1 rounded-xl text-white">
        <button onClick={onEdit} className="p-1 hover:text-[#ffdb99]"><Edit3 className="w-3.5 h-3.5" /></button>
        <button onClick={onDelete} className="p-1 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>

      {/* CARD CONTENT */}
      <div className="relative p-5 text-white space-y-1.5 z-10">
        {item.title && (
          <h4 className="font-serif-title text-xl font-bold leading-snug">{item.title}</h4>
        )}
        {item.content && (
          <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed">{item.content}</p>
        )}
      </div>
    </div>
  );
}
