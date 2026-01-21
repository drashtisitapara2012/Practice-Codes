// import { useEffect, useRef, useState } from "react";
// import { useTodos } from "../../context/TodoContext";

// const AddTodoModal = ({ onClose, editingTodo = null }) => {
//   const { addTodo, editTodo, todos } = useTodos();

//   const [title, setTitle] = useState(editingTodo?.title || "");
//   const [description, setDescription] = useState(editingTodo?.description || "");
//   const [priority, setPriority] = useState(editingTodo?.priority || "Medium");
//   const [dueDate, setDueDate] = useState(editingTodo?.dueDate || "");
//   const [errors, setErrors] = useState({});
//   const [reminderValue, setReminderValue] = useState(editingTodo?.reminder?.value || 0);
//   const [reminderType, setReminderType] = useState(editingTodo?.reminder?.type || "hours");


//   const titleRef = useRef(null);
//   const MAX_DESCRIPTION_LENGTH = 100;
//   const MIN_TITLE_LENGTH = 3;

//   useEffect(() => {
//     titleRef.current.focus();
//     return () => (document.body.style.overflow = "auto");
//   }, []);

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };
// const sanitizeInput = (value = "") => {
//   return value
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#x27;");
// };

//   const validateForm = () => {
//     const trimmedTitle = title.trim();
//     const trimmedDesc = description.trim();

// const safeTitle = sanitizeInput(trimmedTitle);
//   const safeDesc = sanitizeInput(trimmedDesc);
//     const newErrors = {};

//     // Title
//     if (!safeTitle) newErrors.title = "Title is required";
//     else if (safeTitle.length < MIN_TITLE_LENGTH)
//       newErrors.title = `Title must be at least ${MIN_TITLE_LENGTH} characters`;

//     // Description (optional but cannot be just spaces)
//     if (description && !safeDesc)
//       newErrors.description = "Description cannot be just spaces";
//     else if (safeDesc.length > MAX_DESCRIPTION_LENGTH)
//       newErrors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;

//     // Duplicate title
//     const exists = todos.some(
//       (t) =>
//         t.title.toLowerCase() === safeTitle.toLowerCase() &&
//         t.id !== editingTodo?.id
//     );
//     if (exists) newErrors.title = "This TODO already exists";

//     // Due date
//     if (!dueDate) newErrors.dueDate = "Due date is required";
//     else if (dueDate < getTodayDate()) newErrors.dueDate = "Due date cannot be in the past";

//     setErrors(newErrors);

//     // If any errors exist, form is invalid
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const todoData = {
//       title: sanitizeInput(title.trim()),
//       description: sanitizeInput(description.trim()),
//       priority,
//       dueDate,
//       reminder: reminderValue > 0 ? { value: reminderValue, type: reminderType } : null,

//     };

//     if (editingTodo) {
//       editTodo(editingTodo.id, todoData);
//     } else {
//       addTodo({ ...todoData, completed: false });
//     }

//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-10 flex items-start justify-center bg-black/30 pt-10 pb-10 animate-fadeIn"
//       onClick={onClose}
//     >
//       <div
//         className="w-[420px] rounded-xl border border-slate-300/20 bg-gradient-to-br from-white to-slate-100 p-7 shadow-xl animate-slideUp max-w-[90%]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="mb-5 text-[22px] font-bold text-slate-600">
//           {editingTodo ? "Edit TODO" : "Add New TODO"}
//         </h2>

//         <form onSubmit={handleSubmit}>
//           {/* Title */}
//           <div className="mb-4 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-slate-500">
//               Title * (min {MIN_TITLE_LENGTH} characters)
//             </label>
//             <input
//               ref={titleRef}
//               type="text"
//               value={title}
//               onChange={(e) => {
//                 setTitle(e.target.value);
//                 setError("");
//               }}
//               maxLength={100}
//               className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//             />
//             {errors.title &&
//               <p className="mt-1 text-xs text-red-500">{errors.title}</p>
//             }
//           </div>

//           {/* Description */}
//           <div className="mb-4 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-slate-500">
//               Description (max {MAX_DESCRIPTION_LENGTH} characters)
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => {
//                 setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
//                 setError("");
//               }}
//               maxLength={MAX_DESCRIPTION_LENGTH}
//               placeholder={`Enter description (${description.length}/${MAX_DESCRIPTION_LENGTH})`}
//               className="h-20 resize-none rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//             />
//             <small className="mt-1 text-right text-xs text-slate-400">
//               {description.length}/{MAX_DESCRIPTION_LENGTH}
//               {errors.description &&
//                 <p className="mt-1 text-xs text-left text-red-500">{errors.description}</p>
//               }
//             </small>

//           </div>

//           {/* Priority */}
//           <div className="mb-4 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-slate-500">
//               Priority
//             </label>
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>

//           </div>

//           {/* Due Date */}
//           <div className="mb-4 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-slate-500">
//               Due Date *
//             </label>
//             <input
//               type="date"
//               value={dueDate}
//               min={getTodayDate()}
//               onChange={(e) => {
//                 setDueDate(e.target.value);
//                 setError("");
//               }}
//               className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//             />
//             {errors.dueDate &&
//               <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
//             }
//           </div>

//           {/* Reminder */}
//           <div className="mb-4 flex flex-col">
//             <label className="mb-2 text-sm font-semibold text-slate-500">
//               Reminder (optional)
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 min={0}
//                 value={reminderValue}
//                 onChange={(e) => setReminderValue(Number(e.target.value))}
//                 className="h-10 w-24 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//               />
//               <select
//                 value={reminderType}
//                 onChange={(e) => setReminderType(e.target.value)}
//                 className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
//               >
//                 <option value="minutes">Minutes Before</option>
//                 <option value="hours">Hours Before</option>
//                 <option value="days">Days Before</option>
//               </select>
//             </div>
//             {reminderValue < 0 && (
//               <p className="mt-1 text-xs text-red-500">Reminder cannot be negative</p>
//             )}
//           </div>


//           {/* Actions */}
//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="h-10 min-w-[90px] rounded-md bg-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-300"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="h-10 min-w-[90px] rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-400/40"
//             >
//               {editingTodo ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

// };

// export default AddTodoModal;

import { useEffect, useRef, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import { useStaticContent } from "../../context/StaticContentContext";

const AddTodoModal = ({ onClose, editingTodo = null }) => {
  const { addTodo, editTodo, todos } = useTodos();
  const { getText } = useStaticContent();

  const [title, setTitle] = useState(editingTodo?.title || "");
  const [description, setDescription] = useState(editingTodo?.description || "");
  const [priority, setPriority] = useState(editingTodo?.priority || "Medium");
  const [dueDate, setDueDate] = useState(editingTodo?.dueDate || "");
  const [errors, setErrors] = useState({});
  const [reminderValue, setReminderValue] = useState(editingTodo?.reminder?.value || 0);
  const [reminderType, setReminderType] = useState(editingTodo?.reminder?.type || "hours");

  const titleRef = useRef(null);
  const MAX_DESCRIPTION_LENGTH = 100;
  const MIN_TITLE_LENGTH = 3;

  useEffect(() => {
    titleRef.current.focus();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const sanitizeInput = (value = "") => {
    return value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const validateForm = () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    const safeTitle = sanitizeInput(trimmedTitle);
    const safeDesc = sanitizeInput(trimmedDesc);
    const newErrors = {};

    // Title
    if (!safeTitle) {
      newErrors.title = getText('titleRequiredError', 'Title is required');
    } else if (safeTitle.length < MIN_TITLE_LENGTH) {
      newErrors.title = getText('titleMinLengthError', `Title must be at least ${MIN_TITLE_LENGTH} characters`);
    }

    // Description (optional but cannot be just spaces)
    if (description && !safeDesc) {
      newErrors.description = getText('descriptionSpacesError', 'Description cannot be just spaces');
    } else if (safeDesc.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = getText('descriptionMaxLengthError', `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`);
    }

    // Duplicate title
    const exists = todos.some(
      (t) =>
        t.title.toLowerCase() === safeTitle.toLowerCase() &&
        t.id !== editingTodo?.id
    );
    if (exists) {
      newErrors.title = getText('todoDuplicateError', 'This TODO already exists');
    }

    // Due date
    if (!dueDate) {
      newErrors.dueDate = getText('dueDateRequiredError', 'Due date is required');
    } else if (dueDate < getTodayDate()) {
      newErrors.dueDate = getText('dueDatePastError', 'Due date cannot be in the past');
    }

    setErrors(newErrors);

    // If any errors exist, form is invalid
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const todoData = {
      title: sanitizeInput(title.trim()),
      description: sanitizeInput(description.trim()),
      priority,
      dueDate,
      reminder: reminderValue > 0 ? { value: reminderValue, type: reminderType } : null,
    };

    if (editingTodo) {
      editTodo(editingTodo.id, todoData);
    } else {
      addTodo({ ...todoData, completed: false });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-start justify-center bg-black/30 pt-10 pb-10 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-[420px] rounded-xl border border-slate-300/20 bg-gradient-to-br from-white to-slate-100 p-7 shadow-xl animate-slideUp max-w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-[22px] font-bold text-slate-600">
          {editingTodo
            ? getText('editTodoTitle', 'Edit TODO')
            : getText('addTodoTitle', 'Add New TODO')
          }
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-500">
              {getText('titleLabel', 'Title')} * ({getText('minText', 'min')} {MIN_TITLE_LENGTH} {getText('charactersText', 'characters')})
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" });
              }}
              maxLength={100}
              placeholder={getText('titlePlaceholder', 'Enter todo title')}
              className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-500">
              {getText('descriptionLabel', 'Description')} (
              {getText('maxText', 'max')} {MAX_DESCRIPTION_LENGTH}{' '}
              {getText('charactersText', 'characters')})
            </label>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
                setErrors({ ...errors, description: "" });
              }}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder={getText(
                'descriptionPlaceholder',
                `Enter description (${description.length}/${MAX_DESCRIPTION_LENGTH})`
              )}
              className="h-20 resize-none rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
            />

            {/* Error + character count in one line */}
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className={errors.description ? "text-red-500" : "invisible"}>
                {errors.description || "placeholder"}
              </span>

              <span className="text-slate-400">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>


          {/* Priority */}
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-500">
              {getText('priorityLabel', 'Priority')}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
            >
              <option value="Low">{getText('priorityLow', 'Low')}</option>
              <option value="Medium">{getText('priorityMedium', 'Medium')}</option>
              <option value="High">{getText('priorityHigh', 'High')}</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-500">
              {getText('dueDateLabel', 'Due Date')} *
            </label>
            <input
              type="date"
              value={dueDate}
              min={getTodayDate()}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors({ ...errors, dueDate: "" });
              }}
              className="h-10 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
            )}
          </div>

          {/* Reminder */}
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-slate-500">
              {getText('reminderLabel', 'Reminder')} ({getText('optionalText', 'optional')})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={reminderValue}
                onChange={(e) => setReminderValue(Number(e.target.value))}
                placeholder="0"
                className="h-10 w-24 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
              />
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value)}
                className="h-10 flex-1 rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-400 focus:bg-slate-50 focus:ring-2 focus:ring-slate-300/30"
              >
                <option value="minutes">{getText('minutesBefore', 'Minutes Before')}</option>
                <option value="hours">{getText('hoursBefore', 'Hours Before')}</option>
                <option value="days">{getText('daysBefore', 'Days Before')}</option>
              </select>
            </div>
            {reminderValue < 0 && (
              <p className="mt-1 text-xs text-red-500">
                {getText('reminderNegativeError', 'Reminder cannot be negative')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 min-w-[90px] rounded-md bg-slate-200 text-sm font-semibold text-slate-600 transition hover:bg-slate-300"
            >
              {getText('cancelButton', 'Cancel')}
            </button>

            <button
              type="submit"
              className="h-10 min-w-[90px] rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-400/40"
            >
              {editingTodo
                ? getText('updateButton', 'Update')
                : getText('addButton', 'Add')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;