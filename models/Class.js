class Tag {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  };
};

class Shirt {
  constructor(id, name, type, size, stock, TagId, tagName) {
    this.id = id,
    this.name = name;
    this.type = type;
    this.size = size;
    this.stock = stock;
    this.TagId = TagId;
    this.tagName = tagName;
  };
};