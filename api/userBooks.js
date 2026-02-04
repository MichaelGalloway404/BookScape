router.post("/api/user-books", async (req, res) => {
  const { isbn, cover_id } = req.body;
  const userId = req.user.id; 
  console.log(req.user);

  try {
    await pool.query(
      `
      INSERT INTO user_books (user_id, isbn, cover_id)
      VALUES ($1, $2, $3)
      `,
      [userId, isbn, cover_id]
    );

    res.sendStatus(201);
  } catch (err) {
    if (err.code === "23505") {
      return res.sendStatus(409);
    }

    console.error(err);
    res.sendStatus(500);
  }
});
