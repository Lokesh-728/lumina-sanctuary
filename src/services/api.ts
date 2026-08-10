const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const getHeaders = (token: string | null) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const apiService = {
  // Habits / Daily Practice
  async getTasks(token: string) {
    const res = await fetch(`${getApiUrl()}/habits`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(token: string, data: any) {
    const cleanData = { ...data };
    if (!cleanData.dueDate || typeof cleanData.dueDate !== 'string' || cleanData.dueDate.trim() === '') delete cleanData.dueDate;
    if (!cleanData.description || typeof cleanData.description !== 'string' || cleanData.description.trim() === '') delete cleanData.description;

    const res = await fetch(`${getApiUrl()}/habits`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(cleanData),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('API createTask error:', errText);
      throw new Error(`Failed to create task: ${errText}`);
    }
    return res.json();
  },

  async updateTask(token: string, taskId: string, data: any) {
    const cleanData = { ...data };
    if (!cleanData.dueDate || typeof cleanData.dueDate !== 'string' || cleanData.dueDate.trim() === '') delete cleanData.dueDate;

    const res = await fetch(`${getApiUrl()}/habits/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(cleanData),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('API updateTask error:', errText);
      throw new Error(`Failed to update task: ${errText}`);
    }
    return res.json();
  },

  async toggleTask(token: string, taskId: string) {
    const res = await fetch(`${getApiUrl()}/habits/${taskId}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  async archiveTask(token: string, taskId: string) {
    const res = await fetch(`${getApiUrl()}/habits/${taskId}/archive`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to archive task');
    return res.json();
  },

  async restoreTask(token: string, taskId: string) {
    const res = await fetch(`${getApiUrl()}/habits/${taskId}/restore`, {
      method: 'PATCH',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to restore task');
    return res.json();
  },

  async deleteTask(token: string, taskId: string) {
    const res = await fetch(`${getApiUrl()}/habits/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  async getHabitStats(token: string) {
    const res = await fetch(`${getApiUrl()}/habits/stats`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch habit stats');
    return res.json();
  },

  // Affirmations & Categories
  async getCategories(token: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/categories`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(token: string, name: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async deleteCategory(token: string, categoryId: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  async getAffirmations(token: string) {
    const res = await fetch(`${getApiUrl()}/affirmations`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch affirmations');
    return res.json();
  },

  async createAffirmation(token: string, data: any) {
    const res = await fetch(`${getApiUrl()}/affirmations`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create affirmation');
    return res.json();
  },

  async updateAffirmation(token: string, id: string, data: any) {
    const res = await fetch(`${getApiUrl()}/affirmations/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update affirmation');
    return res.json();
  },

  async deleteAffirmation(token: string, id: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete affirmation');
    return res.json();
  },

  async getAffirmationAnalytics(token: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/analytics`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch affirmation analytics');
    return res.json();
  },

  async recordAffirmationRecitation(token: string) {
    const res = await fetch(`${getApiUrl()}/affirmations/recite`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to record recitation');
    return res.json();
  },

  // Vision Board
  async getVisionBoards(token: string) {
    const res = await fetch(`${getApiUrl()}/vision-board`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch vision boards');
    return res.json();
  },

  async createVisionBoard(token: string, data: any) {
    const res = await fetch(`${getApiUrl()}/vision-board`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create vision board');
    return res.json();
  },

  async updateVisionBoard(token: string, boardId: string, data: any) {
    const res = await fetch(`${getApiUrl()}/vision-board/${boardId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update vision board');
    return res.json();
  },

  async deleteVisionBoard(token: string, boardId: string) {
    const res = await fetch(`${getApiUrl()}/vision-board/${boardId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete vision board');
    return res.json();
  },

  async createVisionItem(token: string, data: any) {
    const cleanData = { ...data };
    if (!cleanData.affirmationId || cleanData.affirmationId.length !== 24) delete cleanData.affirmationId;
    if (!cleanData.goalTarget) delete cleanData.goalTarget;
    if (!cleanData.goalProgress) delete cleanData.goalProgress;
    if (!cleanData.targetDate) delete cleanData.targetDate;
    if (!cleanData.linkUrl || typeof cleanData.linkUrl !== 'string' || cleanData.linkUrl.trim() === '') delete cleanData.linkUrl;
    if (!cleanData.content || typeof cleanData.content !== 'string' || cleanData.content.trim() === '') delete cleanData.content;
    if (!cleanData.title || typeof cleanData.title !== 'string' || cleanData.title.trim() === '') delete cleanData.title;

    const res = await fetch(`${getApiUrl()}/vision-board/items`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(cleanData),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('API createVisionItem error details:', errText);
      throw new Error(`Failed to create vision item: ${errText}`);
    }
    return res.json();
  },

  async updateVisionItem(token: string, itemId: string, data: any) {
    const cleanData = { ...data };
    if (!cleanData.affirmationId || cleanData.affirmationId.length !== 24) delete cleanData.affirmationId;
    if (!cleanData.goalTarget) delete cleanData.goalTarget;
    if (!cleanData.goalProgress) delete cleanData.goalProgress;
    if (!cleanData.targetDate) delete cleanData.targetDate;
    if (cleanData.linkUrl === '') delete cleanData.linkUrl;

    const res = await fetch(`${getApiUrl()}/vision-board/items/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(cleanData),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('API updateVisionItem error details:', errText);
      throw new Error(`Failed to update vision item: ${errText}`);
    }
    return res.json();
  },

  async deleteVisionItem(token: string, itemId: string) {
    const res = await fetch(`${getApiUrl()}/vision-board/items/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete vision item');
    return res.json();
  },

  // Journal
  async getJournalEntries(token: string) {
    const res = await fetch(`${getApiUrl()}/journal`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch journal entries');
    return res.json();
  },

  async createJournalEntry(token: string, data: any) {
    const res = await fetch(`${getApiUrl()}/journal`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create journal entry');
    return res.json();
  },

  async deleteJournalEntry(token: string, id: string) {
    const res = await fetch(`${getApiUrl()}/journal/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete journal entry');
    return res.json();
  },

  // Profile
  async getProfile(token: string) {
    const res = await fetch(`${getApiUrl()}/profile`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(token: string, data: any) {
    const res = await fetch(`${getApiUrl()}/profile`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },
};
