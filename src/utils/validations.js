class valide {
  constructor(data, fields) {
    this.data = data;
    this.fields = fields;
    this.errors = {
      errors: [],
    };
    this.results = {};
    this.valideData();
  }

  valideData() {
    this.results = {};
    this.errors = {
      errors: [],
    };

    for (const [key, value] of Object.entries(this.fields)) {
      if (value.validators.required) {
        let required = this.required(key, this.data);

        if (required) {
          this.validType(value.defineType, key, this.data[key]);
        } else {
          this.resultSet(true, [key, "This field is required"]);
        }
      } else {
        if (Object.keys(this.data).includes(key)) {
          this.validType(value.defineType, key, this.data[key]);
        } else {
          if (value.validators.default) {
            this.resultSet(false, [key, value.validators.default]);
          }
        }
      }
    }
  }

  validType(type, key, value) {
    console.log("Value", value);
    if (type == "string") {
      this.chartField(key, value);
    } else if (type == "number") {
      this.integerField(key, value);
    } else if (type == "date") {
      this.dateField(key, value);
    } else if (type == "object") {
      this.objectField(key, value);
    } else if (type == "array") {
      this.arrayField(key, value);
    } else if (type == "bool") {
      this.booleanField(key, value);
    }
  }

  required(value, data) {
    console.log(data[value], "this is data");
    if (data.hasOwnProperty(value) && data[value]) {
      return true;
    }
    return false;
  }

  chartField(key, value) {
    if (typeof value == "string") {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be string`]);
    }
  }

  booleanField(key, value) {
    if (typeof value == "boolean") {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be bool`]);
    }
  }

  integerField(key, value) {
    if (typeof value == "number") {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be integer`]);
    }
  }

  dateField(key, value) {
    if (value instanceof Date) {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be integer`]);
    }
  }

  arrayField(key, value) {
    if (Array.isArray(value)) {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be array`]);
    }
  }

  objectField(key, value) {
    if (typeof value == "object") {
      this.resultSet(false, [key, value]);
    } else {
      this.resultSet(true, [key, `This field must be object`]);
    }
  }

  resultSet(error, data) {
    if (error) {
      let errorNew = {};

      errorNew[data[0]] = data[1];
      this.errors.errors.push(errorNew);
    } else {
      this.results[data[0]] = data[1];
    }
  }

  get resultGet() {
    if (this.errors.errors.length > 0) {
      return this.errors;
    } else {
      return this.results;
    }
  }
}

module.exports = valide;
