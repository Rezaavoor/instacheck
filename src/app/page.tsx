'use client'

import JSZip from 'jszip'
import { useState } from 'react'

export default function Home() {
  type Follower = {
    media_list_data: Array<Object>
    string_list_data: [{ href: string; timestamp: number; value: string }]
  }
  type Following = {
    media_list_data: Array<Object>
    string_list_data: [{ href: string; timestamp: number; value: string }]
  }

  const [notFollowingBack, setNotFollowingBack] = useState<String[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const zip = await JSZip.loadAsync(file)
        const following = zip.files['followers_and_following/following.json']
        const follower = zip.files['followers_and_following/followers_1.json']
        if (following && follower) {
          const followingString = await following.async('string')
          const followerString = await follower.async('string')

          const followerJson = JSON.parse(followerString).map(
            (follower: Follower) => {
              return follower.string_list_data[0].value
            }
          )
          const followingJson = JSON.parse(
            followingString
          ).relationships_following.map((following: Following) => {
            return following.string_list_data[0].value
          })

          setNotFollowingBack(
            followingJson.filter(
              (following: String) => !followerJson.includes(following)
            )
          )
        } else {
          console.log('no following.json or follower_1.json file found')
        }
      } catch (error) {
        console.log('Error extracting ZIP file: ', error)
      }
    }
  }
  return (
    <main className="bg-gradient-to-b from-red-100 to-red-200 py-60">
      <div className="flex w-screen items-center justify-center ">
        <div className="flex items-center justify-center w-2/3">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">ZIP</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <table className="table-auto mx-auto mt-10 text-black">
        <thead>
          <tr>
            <th>Users not following back</th>
          </tr>
        </thead>
        <tbody>
          {notFollowingBack.map((user, index) => (
            <tr key={index}>
              <td>{user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
