const express = require('express');
const Joi = require('joi');
const Portfolio = require('../models/Portfolio');
const { authenticateTokenOrApiKey, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schema
const portfolioSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  category: Joi.string().valid('web-development', 'mobile-app', 'design', 'data-science', 'other').required(),
  technologies: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().uri().optional().allow(''),
  projectUrl: Joi.string().uri().optional().allow(''),
  githubUrl: Joi.string().uri().optional().allow(''),
  status: Joi.string().valid('completed', 'in-progress', 'planned').optional(),
  featured: Joi.boolean().optional(),
  visibility: Joi.string().valid('public', 'private').optional()
});

// Get all portfolio items (with filtering)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      page = 1, 
      limit = 10,
      visibility = 'public'
    } = req.query;

    const filter = { owner: req.user._id };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (visibility) filter.visibility = visibility;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 }
    };

    const portfolios = await Portfolio.find(filter, null, options)
      .populate('owner', 'username email');

    const total = await Portfolio.countDocuments(filter);

    res.json({
      portfolios,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio items' });
  }
});

// Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('owner', 'username email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({ portfolio });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio item' });
  }
});

// Create new portfolio item
router.post('/', async (req, res) => {
  try {
    const { error } = portfolioSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const portfolioData = {
      ...req.body,
      owner: req.user._id,
      studentId: '26466'
    };

    const portfolio = new Portfolio(portfolioData);
    await portfolio.save();

    const populatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate('owner', 'username email');

    res.status(201).json({
      message: 'Portfolio item created successfully',
      portfolio: populatedPortfolio
    });

  } catch (error) {
    console.error('Portfolio creation error:', error);
    res.status(500).json({ message: 'Failed to create portfolio item' });
  }
});

// Update portfolio item
router.put('/:id', async (req, res) => {
  try {
    const { error } = portfolioSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('owner', 'username email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({
      message: 'Portfolio item updated successfully',
      portfolio
    });

  } catch (error) {
    console.error('Portfolio update error:', error);
    res.status(500).json({ message: 'Failed to update portfolio item' });
  }
});

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({ message: 'Portfolio item deleted successfully' });

  } catch (error) {
    console.error('Portfolio deletion error:', error);
    res.status(500).json({ message: 'Failed to delete portfolio item' });
  }
});

// Get public portfolios (for public API access)
router.get('/public/all', authenticateTokenOrApiKey, async (req, res) => {
  try {
    const { category, featured, limit = 10 } = req.query;
    
    const filter = { visibility: 'public' };
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const portfolios = await Portfolio.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('owner', 'username')
      .select('-owner.email');

    res.json({ portfolios });

  } catch (error) {
    console.error('Public portfolio fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch public portfolios' });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/featured', requireRole(['admin']), async (req, res) => {
  try {
    const { featured } = req.body;
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { featured: !!featured },
      { new: true }
    ).populate('owner', 'username email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    res.json({
      message: `Portfolio item ${featured ? 'featured' : 'unfeatured'} successfully`,
      portfolio
    });

  } catch (error) {
    console.error('Portfolio feature toggle error:', error);
    res.status(500).json({ message: 'Failed to update portfolio feature status' });
  }
});

module.exports = router;
