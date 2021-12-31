import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    // author: {type: mongoose.Schema.Types.ObjectId, ref: "Authors"},
    author: {type: String},
    content: {type: String},
    created_at: {type: Date, default: Date.now},
    id: {type: String},
    update_at: {type: Date, default: Date.now},
    url: {type: String},
  })


ReviewSchema.statics.findByReviewDBId = function (id) {
  return this.findOne({ id: id });
};

export default mongoose.model('Reviews', ReviewSchema);


