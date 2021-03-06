/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable react/forbid-prop-types, react/jsx-closing-bracket-location, react/jsx-sort-prop-types, react/prop-types, react/sort-comp */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = require("react");
const _ = require("underscore");
const {StyleSheet, css} = require("aphrodite");

const ApiOptions = require("../perseus-api.jsx").Options;
const Changeable   = require("../mixins/changeable.jsx");
const Editor = require("../editor.jsx");
const PropCheckBox = require("../components/prop-check-box.jsx");
const TextInput = require("../components/text-input.jsx");

const GradedGroupEditor = React.createClass({
    mixins: [Changeable],

    propTypes: {
        title: React.PropTypes.string,
        content: React.PropTypes.string,
        widgets: React.PropTypes.object,
        images: React.PropTypes.object,
        apiOptions: ApiOptions.propTypes,
    },

    getDefaultProps: function() {
        return {
            title: "",
            content: "",
            widgets: {},
            images: {},
            hint: null,
            hasHint: false,
        };
    },

    render: function() {
        return <div className="perseus-group-editor">
            <div className="perseus-widget-row">
                <label className={css(styles.title)}>
                    Title: <TextInput
                        value={this.props.title}
                        className={css(styles.input)}
                        onChange={this.change("title")}
                    />
                </label>
            </div>
            <Editor
                ref="editor"
                content={this.props.content}
                widgets={this.props.widgets}
                apiOptions={this.props.apiOptions}
                enabledFeatures={this.props.enabledFeatures}
                images={this.props.images}
                widgetEnabled={true}
                immutableWidgets={false}
                onChange={this.props.onChange}
                warnNoPrompt={true}
                warnNoWidgets={true}
            />
            <div className={css(styles.hintsTitle)}>
                Hint
            </div>
            <PropCheckBox
                hasHint={this.props.hasHint}
                onChange={this.props.onChange}
                labelAlignment="right"
                label="enabled"
            />
            {this.props.hasHint &&
                <Editor
                    ref="hint-editor"
                    content={this.props.hint ? this.props.hint.content : ''}
                    widgets={this.props.hint ? this.props.hint.widgets : {}}
                    apiOptions={this.props.apiOptions}
                    enabledFeatures={this.props.enabledFeatures}
                    images={this.props.hint && this.props.hint.images}
                    widgetEnabled={true}
                    immutableWidgets={false}
                    onChange={(props) => {
                        // Copy all props over from the existing hint and then
                        // add new props.
                        this.change("hint",
                            Object.assign({}, this.props.hint, props));
                    }}
                />}
        </div>;
    },

    getSaveWarnings: function() {
        return this.refs.editor.getSaveWarnings();
    },

    serialize: function() {
        return {
            title: this.props.title,
            hasHint: this.props.hasHint,
            ...this.refs.editor.serialize(),
            hint: this.props.hasHint
                ? this.refs['hint-editor'].serialize()
                : null,
        };
    },
});

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    input: {
        fontSize: 18,
    },

    hintsTitle: {
        marginTop: 10,
        fontSize: '110%',
        fontWeight: 'bold',
    },
});

module.exports = GradedGroupEditor;
