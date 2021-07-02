const option = {
  getters: true,
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
}
const schemaOptions = {
  toObject: option,
  toJSON: option,
  runSettersOnQuery: true,
};
export default schemaOptions;