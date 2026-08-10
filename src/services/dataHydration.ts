import { apiService } from './api';
import { useLuminaStore } from '@/store/useLuminaStore';

export async function hydrateUserData(token: string) {
  const store = useLuminaStore.getState();

  try {
    // 1. Fetch User Tasks
    const tasks = await apiService.getTasks(token);
    if (Array.isArray(tasks)) {
      store.setDailyTasks(tasks);
    }
  } catch (err) {
    console.error('Error hydrating user tasks:', err);
  }

  try {
    // 2. Fetch Affirmation Categories & Affirmations
    const categories = await apiService.getCategories(token);
    if (Array.isArray(categories)) {
      store.setCategories(categories);
    }

    const affirmations = await apiService.getAffirmations(token);
    if (Array.isArray(affirmations)) {
      store.setAffirmations(affirmations);
    }

    const analytics = await apiService.getAffirmationAnalytics(token);
    if (analytics) {
      store.setAffirmationAnalytics(analytics);
    }
  } catch (err) {
    console.error('Error hydrating affirmations:', err);
  }

  try {
    // 3. Fetch Vision Boards
    const boards = await apiService.getVisionBoards(token);
    if (Array.isArray(boards)) {
      store.setVisionBoards(boards);
    }
  } catch (err) {
    console.error('Error hydrating vision boards:', err);
  }

  try {
    // 4. Fetch Journal Entries
    const entries = await apiService.getJournalEntries(token);
    if (Array.isArray(entries)) {
      const formattedEntries = entries.map((e: any) => ({
        id: e.id,
        date: new Date(e.createdAt || e.entryDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        title: e.title,
        content: e.content,
        tags: e.tags || [],
        mood: e.mood,
        imageUrl: e.imageUrl,
      }));
      store.setGratitudeEntries(formattedEntries);
    }
  } catch (err) {
    console.error('Error hydrating journal entries:', err);
  }

  try {
    // 5. Fetch Profile
    const profile = await apiService.getProfile(token);
    if (profile) {
      store.updateFutureSelfProfile({
        primaryLocation: profile.primaryLocation || '',
        atmosphereVibes: profile.atmosphereVibes || '',
        morningDiscipline: profile.morningDiscipline || '',
        wealthConsciousness: profile.wealthConsciousness || '',
        quote: profile.mottoQuote || '',
      });
    }
  } catch (err) {
    console.error('Error hydrating profile:', err);
  }
}
