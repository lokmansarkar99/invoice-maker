const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
};

const replacements = [
  // Remove uppercase from classNames globally
  { match: / uppercase/g, replace: '' },
  { match: /uppercase /g, replace: '' },
  
  // Specific jargon replacements
  { match: />ID_NAME \*</g, replace: '>Name *<' },
  { match: />COMMS_LINK</g, replace: '>Phone<' },
  { match: />LOC_DATA</g, replace: '>Address<' },
  { match: /\/\/ DOC_ID:/g, replace: 'Invoice ID:' },
  { match: /\/\/ T_STAMP:/g, replace: 'Date:' },
  { match: /\/\/ STATE:/g, replace: 'Status:' },
  { match: /\/\/ CLIENT_DATA/g, replace: 'Customer Information' },
  { match: /\/\/ PAYLOAD_NODES/g, replace: 'Products' },
  { match: /\/\/ SYS_STATE/g, replace: 'Invoice Status' },
  { match: /\/\/ COMPUTATION/g, replace: 'Summary' },
  { match: />TRANSACTION_STATUS</g, replace: '>Status<' },
  { match: />SUBTOTAL_RAW</g, replace: '>Subtotal<' },
  { match: />FINAL_OUTPUT</g, replace: '>Grand Total<' },
  { match: />DEDUCTION \(৳\)</g, replace: '>Discount (৳)<' },
  { match: />DEDUCTION</g, replace: '>Discount<' },
  { match: />EXEC_PRINT</g, replace: '>Print Invoice<' },
  { match: />SAVE_PDF</g, replace: '>Download PDF<' },
  { match: />EDIT_DATA</g, replace: '>Edit<' },
  { match: />PURGE_RECORD</g, replace: '>Delete<' },
  { match: />SYS_NODE_01</g, replace: '>Store Name<' },
  { match: /placeholder="USER_IDENTIFIER"/g, replace: 'placeholder="Customer Name"' },
  { match: /placeholder="SECTOR_GEO"/g, replace: 'placeholder="Address"' },
  { match: /placeholder="QUERY_AVAILABLE_NODES..."/g, replace: 'placeholder="Search products..."' },
  { match: />Node_ID</g, replace: '>Product<' },
  { match: />Multiplier</g, replace: '>Quantity<' },
  { match: />Base_Val</g, replace: '>Price<' },
  { match: />Aggregate</g, replace: '>Total<' },
  { match: />Exec</g, replace: '>Action<' },
  { match: />NULL_RESULT</g, replace: '>No results found<' },
  { match: />UNITS: /g, replace: '>Stock: ' },
  { match: />SYS_UNITS: /g, replace: '>Stock: ' },
  { match: />PAYLOAD_EMPTY: Awaiting input.</g, replace: '>No products added yet.<' },
  { match: />PAID \(CONFIRMED\)</g, replace: '>Paid<' },
  { match: />DUE \(PENDING\)</g, replace: '>Due<' },
  { match: />CANCELLED \(ABORTED\)</g, replace: '>Cancelled<' },
  { match: />EXECUTING_WRITE...</g, replace: '>Saving...<' },
  { match: />EXECUTE_WRITE</g, replace: '>Save Invoice<' },
  { match: />EXECUTE_UPDATE</g, replace: '>Save Changes<' },
  { match: />INIT_INVOICE</g, replace: '>Create Invoice<' },
  { match: /SYS_WARNING: NODE_ALREADY_ATTACHED/g, replace: 'Product already added.' },
  { match: /\[ERR\] PAYLOAD_EMPTY: Add at least one node./g, replace: 'Please add at least one product.' },
  { match: /\[ERR\] INVOICE_GENERATION_FAILED/g, replace: 'Failed to create invoice' },
  { match: /\[ERR\] UPDATE_FAILED/g, replace: 'Failed to update invoice' },
  { match: /\[ERR\] CRITICAL_SYSTEM_ERROR/g, replace: 'An error occurred' },
  { match: /SYS.PRINTER.SPOOL \/\/ DOC_ID: /g, replace: 'Invoice ' },
  { match: /\/\/ TARGET_ENTITY/g, replace: 'Billed To' },
  { match: />Payload_ID</g, replace: '>Product<' },
  { match: />Mult</g, replace: '>Qty<' },
  { match: />Base</g, replace: '>Price<' },
  { match: />Agg</g, replace: '>Total<' },
  { match: /\/\/ END_OF_TRANSMISSION/g, replace: 'Thank you for your business!' },
  { match: />EOF</g, replace: '><' },
  { match: />SYS_NODE</g, replace: '>Invoice Maker<' },
  { match: />SYS_OVERVIEW</g, replace: '>Dashboard<' },
  { match: />\/\/ TOTAL_INVOICES</g, replace: '>Total Invoices<' },
  { match: />\/\/ TOTAL_PRODUCTS</g, replace: '>Total Products<' },
  { match: />\/\/ TODAYS_INVOICES</g, replace: '>Today\'s Invoices<' },
  { match: />\/\/ TODAYS_SALES</g, replace: '>Today\'s Sales<' },
  { match: />SYS_INVENTORY</g, replace: '>Inventory<' },
  { match: />SYS_INVOICES</g, replace: '>Invoices<' },
  { match: />NODE_CONFIGURATION</g, replace: '>Store Settings<' },
  { match: />SYS_SETTINGS</g, replace: '>Settings<' },
  { match: />TERMINATE_SESSION</g, replace: '>Logout<' },
  { match: />INIT_NODE</g, replace: '>Add Product<' },
  { match: />EDIT_NODE</g, replace: '>Edit Product<' },
  { match: />Product_Name</g, replace: '>Product Name<' },
  { match: />Base_Value</g, replace: '>Price<' },
  { match: />Units</g, replace: '>Stock<' },
  { match: />Execute</g, replace: '>Actions<' },
  { match: />Querying Data Stream...</g, replace: '>Loading...<' },
  { match: />Initializing Data Stream...</g, replace: '>Loading...<' },
  { match: />FMT: SQUARE_1x1</g, replace: '>Format: 1x1 Square<' },
  { match: />UPLOAD_IMG</g, replace: '>Upload Logo<' },
  { match: /placeholder="ROOT_USER"/g, replace: 'placeholder="Proprietor Name"' },
  { match: /placeholder="USER@SYS.LOCAL"/g, replace: 'placeholder="Email"' },
  { match: />SYS_AUTH</g, replace: '>Admin Login<' },
  { match: />ACCESS_DENIED</g, replace: '>Invalid credentials<' },
  { match: />AUTHENTICATING...</g, replace: '>Logging in...<' },
  { match: />ESTABLISH_CONNECTION</g, replace: '>Login<' },
  { match: /EXECUTE PURGE\? Action cannot be reversed and stock will be reallocated./g, replace: 'Delete Invoice? This action cannot be undone and will restore stock.' },
  { match: /PURGE_FAILED/g, replace: 'Failed to delete invoice' },
  { match: />RECORD_NOT_FOUND</g, replace: '>Invoice not found<' },
  { match: />EDIT_INVOICE_DATA</g, replace: '>Edit Invoice<' },
  { match: /placeholder="SYS_NODE_01"/g, replace: 'placeholder="Store Name"' },
  { match: /placeholder="SECTOR_7G"/g, replace: 'placeholder="Address"' },
  { match: /"SYS_ERROR: FETCH_FAILED"/g, replace: '"Failed to load invoice"' },
  { match: /"NULL_RESULT"/g, replace: '"Invoice not found"' },
  { match: /"CRITICAL_SYSTEM_ERROR"/g, replace: '"An error occurred"' },
];

const processFile = (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  replacements.forEach(({match, replace}) => {
    newContent = newContent.replace(match, replace);
  });
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

walk(path.join(__dirname, '../src/app/admin'), processFile);
walk(path.join(__dirname, '../src/components/invoice'), processFile);
walk(path.join(__dirname, '../src/components/admin'), processFile);

console.log("Done");
