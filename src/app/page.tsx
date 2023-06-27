'use client'

import { useDropzone, FileWithPath } from 'react-dropzone'
import AdmZip from 'adm-zip'

export default function Home() {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
  })
  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))
  console.log(acceptedFiles)
  if (acceptedFiles.length > 0) {
    const files = acceptedFiles.map((file: FileWithPath) => file)
    const zip = new AdmZip(files[0].path)
    const zipEntries = zip.getEntries()
    console.log(zipEntries)
  }
  return (
    <main className="bg-gradient-to-b from-red-100 to-red-200">
      <div className="flex h-screen w-screen items-center justify-center ">
        <div
          {...getRootProps({
            className: 'dropzone flex w-screen items-center justify-center',
          })}
        >
          <input {...getInputProps()} />
          <button
            className="text-center bg-gradient-to-r from-red-400 to-red-600 w-1/2 rounded-xl px-10 py-3"
            onClick={open}
          >
            Load your Instagram data
          </button>
        </div>
      </div>
      <ul>{files}</ul>
    </main>
  )
}
