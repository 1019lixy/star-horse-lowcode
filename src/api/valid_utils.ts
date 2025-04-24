import {SelectOption} from '@/components/types/SearchProps';

const validTypes: any = [
    {
        message: '邮箱格式不正确',
        value: 'email',
        pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
    },
    {message: '手机号格式不正确', value: 'phone', pattern: /^1[3456789]\d{9}$/},
    {
        message: '座机号码格式不正确',
        value: 'landlinePhone',
        pattern: /^(0\d{2,3})-?\d{7,8}$/
    },
    {
        message: '身份证非法',
        value: 'idCard',
        pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    },
    {message: '只能是数字', value: 'digit', pattern: /^[0-9]*$/},
    {
        message: 'IP格式不正确',
        value: 'ip',
        pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
    },
    {
        message: 'URL格式不正确',
        value: 'url',
        pattern: /^((https?|ftp|file|git|svn):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    },
    {
        message: '域名格式不正确',
        value: 'domain',
        pattern: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/
    },
    {message: '只能是字母', value: 'letter', pattern: /^[a-zA-Z]*$/},
    {message: '只能是字母或数字', value: 'letterDigit', pattern: /^[a-zA-Z0-9]*$/},
    {
        message: (min: number, max: number) => `长度范围须在 ${min} 到 ${max} 之间`,
        value: 'dataLength',
        pattern: (min: number, max: number) => new RegExp(`^.{${min},${max}}$`)
    },
    {message: '只能是字母、数字和下划线', value: 'letterDigitUnderline', pattern: /^[a-zA-Z0-9_]*$/},
    {message: '只能是字母、数字、下划线和中横线', value: 'letterDigitUnderlineHyphen', pattern: /^[a-zA-Z0-9_\-]*$/},
    {
        message: '密码需包含大写字母、小写字母、数字和特殊字符，长度 8 - 16',
        value: 'strongPassword',
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    },
    {
        message: '日期格式应为 YYYY-MM-DD',
        value: 'dateFormat',
        pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    },
    {
        message: '邮政编码格式不正确',
        value: 'postalCode',
        pattern: /^[1-9]\d{5}$/
    },
    {
        message: '中文姓名应为 2 - 6 个汉字',
        value: 'chineseName',
        pattern: /^[\u4e00-\u9fa5]{2,6}$/
    },
    {
        message: '信用卡号格式不正确',
        value: 'creditCard',
        pattern: /^4\d{15}$/
    },
    {
        message: '微信号格式不正确，需以字母开头，包含字母、数字、下划线和减号，长度 6 - 20 个字符',
        value: 'wechatId',
        pattern: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
    },
    {
        message: '车牌号格式不正确',
        value: 'licensePlate',
        pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{5}$/
    },
    {
        message: '港澳通行证号码格式不正确',
        value: 'hkMacaoPass',
        pattern: /^[CW]\d{8}$/
    },
    {
        message: '台胞证号码格式不正确',
        value: 'taiwanPass',
        pattern: /^([A-Z]\d{9}|\d{8})$/
    },
    {
        message: '16 进制颜色代码格式不正确',
        value: 'hexColor',
        pattern: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/
    },
    {
        message: '国际电话号码格式不正确',
        value: 'internationalPhone',
        pattern: /^\+(?:[0-9] ?){6,14}[0-9]$/
    }
];

export const validRulesList: Array<SelectOption> = [
    {name: '邮箱', value: 'email'},
    {name: '手机号', value: 'phone'},
    {name: '座机号码', value: 'landlinePhone'},
    {name: '身份证', value: 'idCard'},
    {name: '数字', value: 'digit'},
    {name: '字母', value: 'letter'},
    {name: 'IP', value: 'ip'},
    {name: 'URL', value: 'url'},
    {name: '域名', value: 'domain'},
    {name: '字母或数字', value: 'letterDigit'},
    {name: '字母、数字和下划线', value: 'letterDigitUnderline'},
    {name: '字母、数字、下划线和中横线', value: 'letterDigitUnderlineHyphen'},
    {name: '数据长度6到12', value: 'dataLength'},
    {name: '强密码', value: 'strongPassword'},
    {name: '日期格式（YYYY-MM-DD）', value: 'dateFormat'},
    {name: '邮政编码', value: 'postalCode'},
    {name: '中文姓名', value: 'chineseName'},
    {name: '信用卡号', value: 'creditCard'},
    {name: '微信号', value: 'wechatId'},
    {name: '车牌号', value: 'licensePlate'},
    {name: '港澳通行证号码', value: 'hkMacaoPass'},
    {name: '台胞证号码', value: 'taiwanPass'},
    {name: '国际电话号码', value: 'internationalPhone'},
    {name: '16进制颜色代码', value: 'hexColor'},
    {name: '自定义', value: 'custom'}
];

/**
 * 获取验证类型
 * @param type
 */
export function getValidType(type: any, options?: any) {
    const typeConfig = validTypes.find((item: any) => item.value === type);
    if (!typeConfig) return {};
    // 处理带参数的验证类型
    if (type === 'dataLength') {
        return {
            message: typeConfig.message(options?.min ?? 2, options?.max ?? 6),
            pattern: typeConfig.pattern(options?.min ?? 2, options?.max ?? 6)
        };
    }
    return typeConfig;
}
