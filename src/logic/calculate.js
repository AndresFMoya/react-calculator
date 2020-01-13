import Big from 'big-js';
import operate from './operate';

const isNumber = item => /[0-9]+/.test(item);

const calculate = (obj, buttonName) => {
  if (buttonName === 'AC') {
    return {
      total: null,
      next: null,
      operation: null,
    };
  }

  if (isNumber(buttonName)) {
    if (obj.operation) {
      if (obj.next) {
        return {
          total: obj.total,
          next: obj.next + buttonName,
          operation: obj.operation,
        };
      }
      return {
        next: buttonName,
        total: obj.total,
        operation: obj.operation,
      };
    }

    if (obj.next) {
      const next = obj.next === '0' ? buttonName : obj.next + buttonName;
      return {
        next,
        total: null,
        operation: obj.operation,
      };
    }

    return {
      next: buttonName,
      total: obj.total,
      operation: obj.operation,
    };
  }

  if (buttonName === '%') {
    if (obj.operation && obj.next) {
      const result = operate(obj.total, obj.next, obj.operation);
      return {
        total: Big(result).div(Big('100')).toString(),
        next: null,
        operation: null,
      };
    }
    if (obj.next) {
      return {
        next: Big(obj.next).div(Big('100')).toString(),
        total: obj.total,
        operation: obj.operation,
      };
    }
    return obj;
  }

  if (buttonName === '.') {
    if (obj.next) {
      if (obj.next.includes('.')) {
        return obj;
      }
      return {
        next: `${obj.next}.`,
        total: obj.total,
        operation: obj.operation,
      };
    }
    return {
      next: '0.',
      total: obj.total,
      operation: obj.operation,
    };
  }

  if (buttonName === '=') {
    if (obj.next && obj.operation) {
      const result = operate(obj.total, obj.next, obj.operation);
      return {
        total: result,
        next: result,
        operation: null,
      };
    }
    return {
      total: obj.total,
      next: obj.next,
      operation: null,
    };
  }

  if (buttonName === '+/-') {
    if (obj.next) {
      return {
        next: (-1 * parseFloat(obj.next)).toString(),
        total: obj.total,
        operation: obj.operation,
      };
    }
    if (obj.total) {
      return {
        total: (-1 * parseFloat(obj.total)).toString(),
        next: obj.next,
        operation: obj.operation,
      };
    }
  }

  if (obj.operation) {
    return {
      total: obj.total,
      next: obj.next,
      operation: buttonName,
    };
  }

  if (!obj.next) {
    return {
      total: '0',
      next: obj.next,
      operation: buttonName,
    };
  }

  return {
    total: obj.next,
    next: null,
    operation: buttonName,
  };
};

export default calculate;
