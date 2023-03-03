const AppError = require('../utils/appError');

deleteOne = Model => async (req, res, next) => {
    try {
        const data = await Model.findByIdAndDelete(req.params.id);

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

deleteAll = Model => async (req, res, next) => {
    try {
        const data = await Model.deleteMany({});

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

updateOne = Model => async (req, res, next) => {
    try {
        const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

create = Model => async (req, res, next) => {
    try {
        const data = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

getOne = (Model, popOptions) => async (req, res, next) => {
    try {
        let query = Model.findById(req.params.id);
        if (popOptions) {
            for (let i = 0; i < popOptions.length; i++) {
                query = query.populate(popOptions[i]);
            }
        };
        const data = await query;

        if (!data) {
            return next(new AppError(404, 'fail', 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
};

getAll = (Model, popOptions) => async (req, res, next) => {
    try {
        let query = Model.find();
        if (popOptions) {
            for (let i = 0; i < popOptions.length; i++) {
                query = query.populate(popOptions[i]);
            }
        };
        const data = await query;

        res.status(200).json({
            status: 'success',
            results: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    deleteOne,
    deleteAll,
    updateOne,
    create,
    getOne,
    getAll
};