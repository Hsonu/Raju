const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/videos
// @desc    Get all active videos (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const videos = await Video.find(query).sort({ isFeatured: -1, order: 1, createdAt: -1 });
    res.json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching videos' });
  }
});

// @route   GET /api/videos/:id
// @desc    Get single video & increment views
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/videos
// @desc    Create / Upload new video (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, category, videoUrl, thumbnailUrl, badgeText, telemetryStats, isFeatured } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and Video URL are required' });
    }

    const video = await Video.create({
      title,
      description,
      category: category || 'chip-level',
      videoUrl,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
      badgeText: badgeText || '4K TECH LAB LIVE',
      telemetryStats: telemetryStats || '45X Stereo Microscope • 380°C BGA Heat Flow',
      isFeatured: isFeatured === true || isFeatured === 'true',
    });

    res.status(201).json({ success: true, data: video, message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating video' });
  }
});

// @route   PUT /api/videos/:id
// @desc    Update video (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, data: video, message: 'Video updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating video' });
  }
});

// @route   DELETE /api/videos/:id
// @desc    Delete video (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting video' });
  }
});

module.exports = router;
