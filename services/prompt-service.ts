const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Mock prompt service
// In a real application, this would make API calls to your backend

interface PromptResponse {
  response: string
  timestamp: string
}

// Mock responses for different tools
const MOCK_RESPONSES: Record<string, string[]> = {
  "explain-code": [
    "This code implements the Fibonacci sequence using recursion. The function takes a number 'n' and returns the nth Fibonacci number. It uses a base case where if n is 0 or 1, it returns n. Otherwise, it recursively calls itself with n-1 and n-2, and returns the sum of these two calls. This is an inefficient implementation due to repeated calculations, and would benefit from memoization or an iterative approach.",
    "This code implements a debounce function, which is a higher-order function that limits the rate at which another function can fire. When you call the debounced function, it waits for a specified time (wait) before executing the original function. If the debounced function is called again during the wait period, the timer resets. This is commonly used for performance optimization in event handlers like scroll or resize events, or for limiting API calls in search inputs.",
  ],
  "fix-bug": [
    "Your bubble sort implementation has a bug. The inner loop should use 'i' as its upper bound, not the array length. Here's the fixed code:\n\n```javascript\nfunction sortArray(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}\n```\n\nThis change makes the algorithm more efficient by avoiding unnecessary comparisons for elements that are already sorted at the end of the array.",
    "There's a syntax error in your fetch code. You're missing a closing parenthesis in the catch block. Here's the fixed code:\n\n```javascript\nfunction fetchData() {\n  fetch('https://api.example.com/data')\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n    })\n    .catch(error => {\n      console.log('Error:', error);\n    });\n}\n```",
  ],
  "generate-regex": [
    "Here's a regex pattern to validate email addresses:\n\n```javascript\nconst emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;\n```\n\nThis pattern checks for:\n- One or more letters, numbers, or special characters before the @ symbol\n- A domain name with letters, numbers, dots, or hyphens\n- A top-level domain with at least 2 letters\n\nYou can use it like this:\n\n```javascript\nconst isValidEmail = emailRegex.test('user@example.com');\n```",
    "Here's a regex pattern to match US phone numbers in the formats you specified:\n\n```javascript\nconst phoneRegex = /^$$?([0-9]{3})$$?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;\n```\n\nThis pattern matches:\n- (123) 456-7890\n- 123-456-7890\n- 123.456.7890\n- 123 456 7890\n\nYou can use it like this:\n\n```javascript\nconst isValidPhone = phoneRegex.test('(123) 456-7890');\n```",
  ],
}

export async function submitPrompt(toolId: string, prompt: string): Promise<PromptResponse> {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/tools/${toolId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error("Failed to process request")
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}
