/* eslint-disable no-undef */
// window.repoFiles = {
//   _data: {
//     "_cats.json": {
//       content:
//         '{\n  "cats": [\n    {\n      "name": "Cat",\n      "desc": "Cat is cool",\n      "id": "cats-GQnCNUpF2"\n    },\n    {\n      "name": "Dog",\n      "desc": "Dog is alright",\n      "id": "cats-S_Aev5Ts-B"\n    },\n    {\n      "name": "Hippo",\n      "desc": "Hippo is love",\n      "id": "cats-1wpAUDyA-W"\n    }\n  ]\n}'
//     }
//   },
//   _posts: {
//     "post-mfYTWoPYN.md": {
//       content: "---\ntitle: Hello World\nid: post-mfYTWoPYN\\n---"
//     },
//     "post-Rarn0HeUo.md": {
//       content: "---\ntitle: Hallo Welt\nid: post-Rarn0HeUo\n---"
//     },
//     "post-Rarn0He12.md": {
//       content: "---\ntitle: 안녕 세상\nid: post-Rarn0He12\n---"
//     }
//   }
// };

const { fromJS } = Immutable;

const Control = createClass({
  getInitialState: function() {
    return {
      options: []
    };
  },
  componentDidMount: function() {
    const { loadEntry, field } = this.props;

    const collection = field.get("collection");
    const file = field.get("file");
    const fieldName = field.get("target_field");
    const fieldId = field.get("id_field");
    const fieldDisplay = field.get("display_fields") || fieldId;

    loadEntry(collection, file).then(results => {
      const data = results.payload.entry.data[fieldName];
      const options = data.map(option => ({
        value: option[fieldId],
        label: option[fieldDisplay]
      }));
      this.setState({ options });
    });
  },

  changeHandler: function(event) {
    const { onChange } = this.props;
    const { options } = this.state;
    const selectedValue = event.target.value;
    const selected = options.find(option => option.value === selectedValue);
    onChange(fromJS(selected));
  },

  getSelectedValue: function(value, options) {
    let selected = { value: "" };
    if (!value) return selected;
    const maybeOption = options.find(
      option => option.value === value.get("value")
    );
    if (maybeOption) {
      selected = maybeOption;
    }
    return selected;
  },

  render: function() {
    const {
      value,
      forID,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle
    } = this.props;
    const { options } = this.state;
    const selected = this.getSelectedValue(value, options);

    const allOptions = options.slice();
    allOptions.unshift({
      value: "",
      label: "please select..."
    });

    return h(
      "select",
      {
        className: classNameWrapper,
        onFocus: setActiveStyle,
        onBlur: setInactiveStyle,
        name: "categories",
        onChange: this.changeHandler,
        id: forID
      },
      allOptions.map(option =>
        h(
          "option",
          {
            value: option.value,
            selected: option.value === selected.value
          },
          option.label
        )
      )
    );
  }
});

CMS.registerWidget("custom-file-relation", Control);
