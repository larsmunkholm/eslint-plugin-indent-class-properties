/**
 * @fileoverview A rule for indentation of class properties.
 * @author Lars Munkholm
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "A rule for indentation of class properties.",
            recommended: false
        },
        fixable: null,
        schema: [
            {
                oneOf: [
                    {
                        enum: ["tab"],
                    },
                    {
                        type: "integer",
                        minimum: 0,
                    },
                ],
            },
        ],
        messages: {
            wrongIndentation: "Expected indentation of {{expected}} but found {{actual}}.",
        },
    },

    create: function(context) {
        const sourceCode = context.getSourceCode();
        let indentType = "space";
        let indentSize = 4;

        if (context.options.length) {
            if (context.options[0] === "tab") {
                indentSize = 1;
                indentType = "tab";
            } else {
                indentSize = context.options[0];
                indentType = "space";
            }
        }


        /**
         * Creates an error message for a line, given the expected/actual indentation.
         *
         * @param {number} expectedAmount - The expected amount of indentation characters for this line
         * @param {number} actualSpaces   - The actual number of indentation spaces that were found on this line
         * @param {number} actualTabs     - The actual number of indentation tabs that were found on this line
         * @returns {string} An error message for this line
         */
        function createErrorMessageData(expectedAmount, actualSpaces, actualTabs) {
            const expectedStatement = `${expectedAmount} ${indentType}${expectedAmount === 1 ? "" : "s"}`; // e.g. "2 tabs"
            const foundSpacesWord = `space${actualSpaces === 1 ? "" : "s"}`; // e.g. "space"
            const foundTabsWord = `tab${actualTabs === 1 ? "" : "s"}`; // e.g. "tabs"
            let foundStatement;

            if (actualSpaces > 0) {

                /*
                 * Abbreviate the message if the expected indentation is also spaces.
                 * e.g. 'Expected 4 spaces but found 2' rather than 'Expected 4 spaces but found 2 spaces'
                 */
                foundStatement = indentType === "space" ? actualSpaces : `${actualSpaces} ${foundSpacesWord}`;
            } else if (actualTabs > 0) {
                foundStatement = indentType === "tab" ? actualTabs : `${actualTabs} ${foundTabsWord}`;
            } else {
                foundStatement = "0";
            }
            return {
                expected: expectedStatement,
                actual: foundStatement,
            };
        }


        /*
         * Join the listeners, and add a listener to verify that all tokens actually have the correct indentation
         * at the end.
         */
        return Object.assign(
            {
                "*:exit"(node) {
                    const startColumn = node.loc.start.column;

                    if (node.type === "ClassProperty") {
                        const desiredIndentSize = indentSize + sourceCode.text.substring(node.parent.start - node.parent.loc.start.column, node.parent.start).match(/^\s*/)[0].length;
                        const indentation = sourceCode.text.substring(node.start - startColumn, node.start);
                        const numberOfSpaces = (indentation.match(/ /g) || []).length;
                        const numberOfTabs = (indentation.match(/\t/g) || []).length;

                        if (
                            indentType === "tab" && numberOfSpaces > 0 ||
                            indentType === "spaces" && numberOfTabs > 0 ||
                            startColumn !== desiredIndentSize
                        ) {
                            context.report({
                                node: node,
                                messageId: "wrongIndentation",
                                data: createErrorMessageData(indentSize, numberOfSpaces, numberOfTabs),
                                loc: {
                                    start: { line: node.loc.start.line, column: 0 },
                                    end: { line: node.loc.start.line, column: node.loc.start.column },
                                },
                            });
                        }
                    }
                },
            },
        );
    }
};
