import { useRef, useState } from 'react'
import { HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2'

export default function ImageUpload({ value, onChange, label = 'Photo' }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(value || null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="label">{label}</label>

      {preview ? (
        <div className="relative w-28 h-28 group">
          <img
            src={preview}
            alt="preview"
            className="w-28 h-28 rounded-2xl object-cover border-2 border-primary-200 dark:border-primary-800"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                       flex items-center justify-center shadow hover:bg-red-600 transition-colors"
          >
            <HiOutlineXMark className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600
                     flex flex-col items-center justify-center gap-1.5 text-gray-400 dark:text-gray-500
                     hover:border-primary-400 hover:text-primary-500 dark:hover:border-primary-500
                     transition-all duration-200 cursor-pointer"
        >
          <HiOutlinePhoto className="w-7 h-7" />
          <span className="text-xs font-medium">Upload</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
