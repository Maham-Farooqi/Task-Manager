module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Due Today</title>
</head>
<body>
  <p>Hi, this is a reminder that your task "<strong>{Name}</strong>" is due today.</p>
<p>Click the button below to view it:</p>
<a href="http://localhost:5173/viewTasks" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">View Task</a>

</body>
</html>
`