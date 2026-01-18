import { supabase } from '../supabase.js';

/**
 * Create a new check-in entry
 * POST /entry
 */
export const createEntry = async (req, res) => {
  try {
    const { goal, mood, note } = req.body;

    // TEMP USER until auth added
    const userId = "local-user";

    if (!goal) {
      return res.status(400).json({
        error: "Goal is required"
      });
    }

    const { data: newEntry, error: insertError } = await supabase
      .from("entries")
      .insert([
        {
          user_id: userId,
          goal: goal,
          mood: mood || null,
          note: note || null
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        error: "Failed to create entry",
        message: insertError.message
      });
    }

    res.status(201).json({
      message: "Entry created successfully",
      entry: newEntry
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};

/**
 * Get all check-in entries for the authenticated user
 * GET /entries
 */
export const getEntries = async (req, res) => {
  try {
    const userId = "local-user";

    const { data: entries, error } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch",
        message: error.message
      });
    }

    res.json({
      entries: entries || []
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


/**
 * Delete a check-in entry
 * DELETE /entry/:id
 */
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Entry ID is required' 
      });
    }

    // Delete directly (no auth for now)
    const { error: deleteError } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ 
        error: 'Failed to delete entry', 
        message: deleteError.message 
      });
    }

    res.status(200).json({
      message: 'Entry deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};

