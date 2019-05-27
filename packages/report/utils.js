const objectql = require('@steedos/objectql');

const getObject = (object_name)=> {
    return objectql.getSteedosSchema().getObject(object_name);
}

const getObjectConfig = (object_name)=> {
    let object = getObject(object_name);
    return object ? object.toConfig() : null;
}

const formatObjectFields = (objectConfig) => {
    let fields = objectConfig.fields;
    let tempField, tempFieldType, result, index = 0;
    result = {};
    for (let key in fields) {
        tempField = fields[key];
        tempFieldType = convertFieldType(tempField);
        if (tempFieldType) {
            result[index] = {
                "Name": key,
                "Index": -1,
                "NameInSource": key,
                "Alias": tempField.label ? tempField.label : key,
                "Type": tempFieldType
            };
            index++;
        }
    }
    return result;
}

const convertFieldType = (tempField)=> {
    let type = tempField.type;
    if (!type) {
        return null;
    }
    if (tempField.multiple) {
        // 忽略所有数组字段类型
        return null;
    }
    let ignoreTypes = ["[text]", "[phone]", "password", "[Object]", "checkbox", "grid"];
    if (ignoreTypes.includes(type)) {
        // 忽略这些字段类型
        return null;
    }
    let defaultType = "System.String";
    switch (type) {
        case "date":
            return "System.DateTime"
        case "datetime":
            return "System.DateTime"
        case "currency":
            return "System.Double"
        case "number":
            return "System.Double"
        case "boolean":
            return "System.Boolean"
        case "filesize":
            return "System.Double"
        case "Object":
            return "System.Object"
        case "object":
            return "System.Object"
        case "location":
            return "System.Object"
        default:
            return defaultType
    }
}

const getDatabases = (report, objectConfig)=> {
    if (!(report && objectConfig)) {
        return {};
    }
    let dataUrl = `/api/report/data/${report._id}`;
    return {
        "0": {
            "Ident": "StiJsonDatabase",
            "Name": report.name,
            "Alias": report.name,
            "PathData": dataUrl
        }
    };
}
const getDataSources = (report, objectConfig)=> {
    if (!(report && objectConfig)) {
        return {};
    }
    let columns = formatObjectFields(objectConfig);
    return {
        "0": {
            "Ident": "StiDataTableSource",
            "Name": objectConfig.name,
            "Alias": objectConfig.label,
            "Columns": columns,
            "NameInSource": `${report.name}.${objectConfig.name}`
        }
    };
}

exports.getObject = getObject;
exports.getObjectConfig = getObjectConfig;
exports.getDatabases = getDatabases;
exports.getDataSources = getDataSources;