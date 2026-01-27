import { create } from 'zustand';

/**
 * UI状态Store
 * 管理界面状态、弹窗、加载等
 */

const useUIStore = create((set) => ({
  // ========== 加载状态 ==========
  
  isLoading: false,
  loadingMessage: '',
  
  setLoading: (isLoading, message = '') => {
    set({ isLoading, loadingMessage: message });
  },
  
  // ========== 弹窗状态 ==========
  
  modals: {
    assist: false,        // Assist弹窗
    weaponPanel: false,   // 武器面板
    result: false,        // 结果弹窗
    report: false         // 课堂报告
  },
  
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true
      }
    }));
  },
  
  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false
      }
    }));
  },
  
  closeAllModals: () => {
    set({
      modals: {
        assist: false,
        weaponPanel: false,
        result: false,
        report: false
      }
    });
  },
  
  // ========== 通知/提示 ==========
  
  toast: null,  // { type: 'success'|'error'|'info', message: string }
  
  showToast: (type, message, duration = 3000) => {
    set({ toast: { type, message } });
    
    // 自动隐藏
    setTimeout(() => {
      set({ toast: null });
    }, duration);
  },
  
  hideToast: () => {
    set({ toast: null });
  },
  
  // ========== 动画状态 ==========
  
  animations: {
    lightUp: false,       // 亮灯动画
    celebrate: false,     // 庆祝动画
    shake: false,         // 震动动画
    sparkle: false        // 拼写消消乐动画
  },
  
  triggerAnimation: (animationName) => {
    set((state) => ({
      animations: {
        ...state.animations,
        [animationName]: true
      }
    }));
    
    // 自动重置（动画结束后）
    setTimeout(() => {
      set((state) => ({
        animations: {
          ...state.animations,
          [animationName]: false
        }
      }));
    }, 1500);
  },
  
  // ========== 侧边栏/面板 ==========
  
  sidebars: {
    wordInfo: false,      // 单词信息侧边栏
    progress: false,      // 进度侧边栏
    settings: false       // 设置侧边栏
  },
  
  toggleSidebar: (sidebarName) => {
    set((state) => ({
      sidebars: {
        ...state.sidebars,
        [sidebarName]: !state.sidebars[sidebarName]
      }
    }));
  },
  
  closeSidebar: (sidebarName) => {
    set((state) => ({
      sidebars: {
        ...state.sidebars,
        [sidebarName]: false
      }
    }));
  },
  
  closeAllSidebars: () => {
    set({
      sidebars: {
        wordInfo: false,
        progress: false,
        settings: false
      }
    });
  },
  
  // ========== 反馈状态 ==========
  
  feedback: {
    type: null,     // 'correct' | 'incorrect' | 'hint'
    message: '',
    visible: false
  },
  
  showFeedback: (type, message) => {
    set({
      feedback: {
        type,
        message,
        visible: true
      }
    });
  },
  
  hideFeedback: () => {
    set({
      feedback: {
        type: null,
        message: '',
        visible: false
      }
    });
  },
  
  // ========== 重置 ==========
  
  reset: () => {
    set({
      isLoading: false,
      loadingMessage: '',
      modals: {
        assist: false,
        weaponPanel: false,
        result: false,
        report: false
      },
      toast: null,
      animations: {
        lightUp: false,
        celebrate: false,
        shake: false,
        sparkle: false
      },
      sidebars: {
        wordInfo: false,
        progress: false,
        settings: false
      },
      feedback: {
        type: null,
        message: '',
        visible: false
      }
    });
  }
}));

export default useUIStore;
