import * as fs from 'fs';
import typedocJson from '../../docs/api/api-doc.json' with { type: 'json' };

const singleTab = '  ';
const tabsNumber = {
  0: '',
  1: singleTab,
  2: singleTab + singleTab,
  3: singleTab + singleTab + singleTab,
};

function generateMarkdownFromTypedoc(data) {
  let markdown = `---
title: 5.4. API
---\n\n`;

  // Page title
  markdown += `# ${data.name}\n\n`;

  // Page sections
  if (data.groups) {
    data.groups.forEach((group) => {
      markdown += `## ${group.title}\n\n`;
      group.children.forEach((childId) => {
        const child = data.children.find((c) => c.id === childId);
        // kind 256 or kind 2097152
        if (child.variant === 'declaration') {
          markdown += generateMarkdownForItem(child);
        } else if (child.kind === 64) {
          // TODO
          throw Error('64 kind is unexpected');
        } else if (child.kind === 32) {
          // TODO
          throw Error('32 kind is unexpected');
        } else {
          throw Error('Unexpected data');
        }
      });
    });
  }

  return markdown;
}

function generateMarkdownForItem(item) {
  let markdown = '';

  // Add item title
  markdown += `### ${item.name}\n\n`;

  if (item.comment && item.comment.summary) {
    markdown += getComments(item.comment.summary, 0);
  }

  if (item?.children) {
    item.groups.forEach((group) => {
      markdown += `#### ${group.title}\n`;

      // list of ids from the item children
      group.children.forEach((id) => {
        const itemGroup = getItemFromGroup(item.children, id);
        if (itemGroup.type?.type === 'union') {
          markdown += `* **${itemGroup.name}**\n\n`;
          if (itemGroup.type?.declaration?.children) {
            itemGroup.type.types.forEach((type) => {
              markdown += `${type.value}`;
            });
          } else if (itemGroup.type.types) {
            markdown += getMarkdownCodeBlock(getNameWithType(itemGroup), 2);
          }

          if (itemGroup.comment && itemGroup.comment.summary) {
            markdown += getComments(itemGroup.comment.summary, 2);
          }
        } else if (
          itemGroup.type?.type === 'reference' ||
          itemGroup.type?.type === 'intrinsic' ||
          itemGroup.type?.type === 'literal' ||
          itemGroup.type?.type === 'array'
        ) {
          markdown += `* **${itemGroup.name}**\n\n`;
          markdown += getMarkdownCodeBlock(getNameWithType(itemGroup), 2);

          if (itemGroup.comment && itemGroup.comment.summary) {
            markdown +=
              getComments(itemGroup.comment.summary, 2);
          }

          if (itemGroup.comment && itemGroup.comment.blockTags) {
            markdown += singleTab + singleTab + `**Example:**\n\n`;
            markdown += getBlockTag(itemGroup.comment.blockTags, 2);
          }
        } else if (itemGroup.type?.type === 'reflection') {
          if (itemGroup.type?.declaration?.children) {
            markdown += `* **${itemGroup.name}**\n\n`;

            if (itemGroup.comment && itemGroup.comment.summary) {
              markdown += getComments(itemGroup.comment.summary, 2);
            }

            if (itemGroup.comment && itemGroup.comment.blockTags) {
              markdown += singleTab + singleTab + `**Example:**\n\n`;
              markdown += getBlockTag(itemGroup.comment.blockTags, 2);
            }

            itemGroup.type.declaration.groups.forEach((itemSubGroup) => {
              itemSubGroup.children.forEach((itemSubGroupChildrenId) => {
                const itemSubGroupChildren = getItemFromGroup(
                  itemGroup.type.declaration.children,
                  itemSubGroupChildrenId
                );
                markdown +=
                  singleTab + `* **${itemSubGroupChildren.name}**\n\n`;

                if (
                  itemSubGroupChildren.type.declaration &&
                  itemSubGroupChildren.type.declaration.signatures
                ) {
                  markdown += getMarkdownCodeBlock(
                    getSignatureParams(
                      itemSubGroupChildren.name,
                      itemSubGroupChildren.type.declaration.signatures[0]
                    ),
                    2
                  );

                  if (
                    itemSubGroupChildren.comment &&
                    itemSubGroupChildren.comment.summary
                  ) {
                    markdown +=
                      getComments(itemSubGroupChildren.comment.summary, 2);
                  }
  
                  if (itemSubGroupChildren.comment && itemSubGroupChildren.comment.blockTags) {
                    markdown += singleTab + singleTab + `**Example:**\n\n`;
                    markdown += getBlockTag(itemSubGroupChildren.comment.blockTags, 2);
                  }

                  // Properties with a method as type
                  markdown += singleTab + singleTab + `**Parameters:**\n\n`;
                  if (itemSubGroupChildren.type.declaration.signatures[0] && itemSubGroupChildren.type.declaration.signatures[0].parameters && itemSubGroupChildren.type.declaration.signatures[0].parameters.some(param => param.comment)) {
                    itemSubGroupChildren.type.declaration.signatures[0].parameters.forEach(param => {
                      markdown += getParamsComments(param.name, param.comment.summary, 2);
                    });
                  }
                  markdown += getMarkdownCodeBlock(
                    getParameters(
                      itemSubGroupChildren.type.declaration.signatures,
                      0
                    ),
                    2
                  );
                  markdown += singleTab + singleTab + '**Returns:** ';
                  markdown +=
                    '`' +
                    getType(
                      itemSubGroupChildren.type.declaration.signatures[0]
                    ) +
                    '`';
                  markdown += `\n\n`;
                }
              });
            });
          } else {
            markdown += `* **${itemGroup.name}**\n\n`;
            markdown += getMarkdownCodeBlock(
              getSignatureParams(
                itemGroup.name,
                itemGroup.type?.declaration?.signatures[0]
              ),
              1
            );

            if (itemGroup.comment && itemGroup.comment.summary) {
              markdown += getComments(itemGroup.comment.summary, 1);
            }

            if (itemGroup.comment && itemGroup.comment.blockTags) {
              markdown += singleTab + singleTab + `**Example:**\n\n`;
              markdown += getBlockTag(itemGroup.comment.blockTags, 2);
            }

            // Properties with a method as type
            if (itemGroup.type?.declaration?.signatures[0].parameters) {
              markdown += singleTab + `**Parameters:**\n\n`;
              if (itemGroup.type?.declaration?.signatures[0] && itemGroup.type?.declaration?.signatures[0].parameters && itemGroup.type?.declaration?.signatures[0].parameters.some(param => param.comment)) {
                itemGroup.type?.declaration?.signatures[0].parameters.forEach(param => {
                  markdown += getParamsComments(param.name, param.comment.summary, 2);
                });
              }
              markdown += getMarkdownCodeBlock(
                getParameters(itemGroup.type?.declaration?.signatures, 0),
                1
              );
            }

            if (itemGroup.type?.declaration.signatures[0].type) {
              markdown += singleTab + '**Returns:**\n';
              markdown +=
                '`' + getType(itemGroup.type?.declaration?.signatures[0]) + '`';
              markdown += `\n\n`;
            }
          }
        } else if (itemGroup.signatures) {
          markdown += `* **${itemGroup.name}**\n\n`;
          markdown += getMarkdownCodeBlock(
            getNameWithType(itemGroup.signatures[0]),
            1
          );

          if (
            itemGroup.signatures[0].comment &&
            itemGroup.signatures[0].comment.summary
          ) {
            markdown +=
              singleTab + getComments(itemGroup.signatures[0].comment.summary, 0);
          }

          if (itemGroup.signatures[0].comment && itemGroup.signatures[0].comment.blockTags) {
            markdown += singleTab + singleTab + `**Example:**\n\n`;
            markdown += getBlockTag(itemGroup.signatures[0].comment.blockTags, 2);
          }

          // Methods
          if (itemGroup.signatures[0].parameters) {
            markdown += singleTab + `**Parameters:**\n\n`;
            if (itemGroup.signatures[0] && itemGroup.signatures[0].parameters && itemGroup.signatures[0].parameters.some(param => param.comment)) {
              itemGroup.signatures[0].parameters.forEach(param => {
                if (param.comment) {
                  markdown += getParamsComments(param.name, param.comment.summary, 2);
                }
              });
            }
            markdown += getMarkdownCodeBlock(
              getParameters(itemGroup.signatures, 0),
              1
            );
          }

          const isMethod =
            itemGroup.signatures[0].kind === 4096 ||
            itemGroup.signatures[0].kind === 2048;
          if (isMethod) {
            markdown += singleTab + '**Returns:**\n';
            markdown += '`' + getType(itemGroup.signatures[0]) + '`';
            markdown += `\n\n`;
          }
        }
      });
    });
  } else {
    markdown += getMarkdownCodeBlock(getNameWithType(item), 0);
  }

  // add source if exists
  if (item.sources && item.sources.length > 0) {
    markdown += `#### Source: [${item.sources[0].fileName}:${item.sources[0].line}](${item.sources[0].url})\n\n`;
  }

  return markdown;
}

function getItemFromGroup(itemList, id) {
  return itemList.find((item) => item.id === id);
}

function getNameWithType(data) {
  const isMethod = data.kind === 4096 || data.kind === 2048;
  let parentheses = '';
  if (isMethod) {
    parentheses = '()';
    if (data.parameters) {
      const params = data.parameters.map((it) => it.name);
      parentheses = `(${params})`;
    }
  }
  const optional = data.flags?.isOptional ? '?' : '';
  const type = getType(data);
  return `${data.name}${parentheses}${optional}: ${type}`;
}

function getType(data) {
  let markdown = '';

  if (data.type?.type === 'union' && data.type?.types) {
    const types = data.type.types
      .map((it) => {
        return it.value === null ? 'null' : it.value || it.name;
      })
      .join(' | ');
    markdown += `${types}`;
  } else {
    const options = {
      array: `${data.type?.elementType?.name}[]`,
      reference: `${
        data.type?.typeArguments
          ? `${data.type.name}<${data.type.typeArguments[0].name}>`
          : data.type?.name
      }`,
      literal: `${
        data.type?.value === null ? 'null' : `"${data.type?.value}"`
      }`,
      intrinsic: `${data.type?.name}`,
    };
    markdown += `${options[data.type?.type]}`;
  }
  return markdown;
}

function getParameters(signatures, tabs) {
  let paramsParts = '';
  signatures.forEach((signature) => {
    if (signature.parameters) {
      signature.parameters.forEach((param) => {
        if (param.type.type === 'reflection') {
          let part = '';
          if (param.type.declaration?.children) {
            part = tabsNumber[tabs] + `${param.name}: {\n`;
            param.type.declaration.children.forEach((it) => {
              part +=
                tabsNumber[tabs] + singleTab + `${it.name}: ${it.type.name}\n`;
            });
            part += tabsNumber[tabs] + '}';
          } else if (param.type.declaration?.signatures) {
            part +=
              tabsNumber[tabs] +
              getSignatureParams(
                param.name,
                param.type.declaration.signatures[0]
              ) +
              '\n';
          } else if (param.type.type === 'array') {
            part += tabsNumber[tabs] + getNameWithType(param) + '\n';
          }
          paramsParts += part;
        } else {
          paramsParts += tabsNumber[tabs] + getNameWithType(param) + '\n';
        }
      });
    }
  });
  return paramsParts;
}

function getBlockTag(commentBlockTag, tabs) {
  const block = commentBlockTag.map((block) => {
    return block.content.map(content => content.text).join(' \n');
  }).join(' \n\n');
  const formatContent = block.split('\n')
  .map((item) => tabsNumber[tabs] + item)
  .join('\n');
  return `${formatContent}\n\n`;
}

function getComments(comentSummary, tabs) {
  const comment = comentSummary.map((summary) => summary.text).join(' ');
  return `${tabsNumber[tabs]}${comment}\n\n`;
}

function getParamsComments(paramName, comentSummary, tabs) {
  const comment = comentSummary.map((summary) => summary.text).join(' ');
  return `${tabsNumber[tabs]}\`${paramName}\` ${comment}\n\n`;
}

function getSignatureParams(paramName, signature) {
  const params = signature.parameters?.map((it) => it.name).join(', ') || '';
  if (signature.typeParameter) {
    const typeParameter = signature.typeParameter[0];
    if (typeParameter.type) {
      return `${paramName}: <${typeParameter.name} extends ${typeParameter.type?.operator} ${typeParameter.type?.target?.name}>(${params}) => ${signature.type.name}`;
    } else {
      return `${paramName}: <${typeParameter.name}>(${params}) => ${signature.type.name}`;
    }
  } else {
    return `${paramName}: (${params}) => ${signature.type.name}`;
  }
}

function getMarkdownCodeBlock(content, tabs) {
  const formatContent = content
    .split('\n')
    .map((item) => tabsNumber[tabs] + item)
    .join('\n');

  return (
    tabsNumber[tabs] +
    '```javascript\n' +
    formatContent +
    '\n' +
    tabsNumber[tabs] +
    '```\n'
  );
}

const markdown = generateMarkdownFromTypedoc(typedocJson);

// write markdown in a file
fs.writeFileSync('api.md', markdown);

console.log('document created successfully');
