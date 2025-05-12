

// Kiểu ngày tháng năm giờ phút giây sử dụng chính là ISO

const formatDateToVNDashDatetime = ( isoDate ) => {
    if (!isoDate instanceof Date) {
        const error = new Error('Convert to VN dash date time format failed')
        error.status = 500
        throw error;
    }

    const day = String(isoDate.getDate()).padStart(2, '0');
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const year = isoDate.getFullYear();
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`; // Nhận Date → trả định dạng dd/mm/yyyy hh:mm:ss
}

const formatDateToVNSlashDatetime = ( isoDate ) => {
    if (!isoDate instanceof Date) {
        const error = new Error('Convert to VN slash date time format failed')
        error.status = 500
        throw error;
    }

    const day = String(isoDate.getDate()).padStart(2, '0');
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const year = isoDate.getFullYear();
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;  // Nhận Date → trả định dạng dd-mm-yyyy hh:mm:ss
}

const formatDateToEUFormat  = ( isoDate ) => {
    if (!isoDate instanceof Date) {
        const error = new Error('Convert to EU date format failed')
        error.status = 500
        throw error;
    }
    const day = String(isoDate.getDate()).padStart(2, '0');
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const year = isoDate.getFullYear();
    return `${day}-${month}-${year}`; // Nhận Date → trả định dạng DD-MM-YYYY
}

const formatDateToVNFormat  = ( isoDate ) => {
    if (!isoDate instanceof Date) {
        const error = new Error('Convert to VN date format failed')
        error.status = 500
    }
    const day = String(isoDate.getDate()).padStart(2, '0');
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const year = isoDate.getFullYear();
    return `${day}/${month}/${year}`; // Nhận Date → trả định dạng DD/MM/YYYY
}

const formatDateToVNTime  = ( isoDate ) => {
    if (!iso instanceof Date) {
        const error = new Error('Convert to VN time format failed')
        error.status = 500
    }

    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`; // Nhận Date → trả định dạng HH:mm:ss
}

const formatDateDashToSlash = ( stringDate ) => {
    if (typeof stringDate !== 'string' || !/^\d{2}-\d{2}-\d{4}$/.test(str)) {
        const error = new Error('Convert to Slash date format failed')
        error.status = 500
        throw error;
    }
    return stringDate.replace(/-/g, '/'); // Nhận chuỗi DD-MM-YYYY → trả DD/MM/YYYY
}

const formatDateSlashToDash = ( stringDate ) => {
    if (typeof stringDate !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const error = new Error('Convert to Dash date format failed')
        error.status = 500
        throw error;
    }
    return str.replace(/\//g, '-'); // Nhận chuỗi DD-MM-YYYY → trả DD/MM/YYYY
}

module.exports = {
    formatDateToVNDashDatetime,
    formatDateToVNSlashDatetime,
    formatDateToEUFormat,
    formatDateToVNFormat,
    formatDateToVNTime,
    formatDateDashToSlash,
    formatDateSlashToDash
}