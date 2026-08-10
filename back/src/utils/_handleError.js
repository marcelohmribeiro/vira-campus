function handleError(error, req, res, next) {
	console.error(`[${new Date().toISOString()}] Erro em ${req.method} ${req.originalUrl}`);
	console.error(error);

	// Zod — erro de validação de schema
	if (error.name === "ZodError") {
		return res.status(400).json({
			error: "Dados inválidos",
			details: error.issues.map((issue) => ({
				campo: issue.path.join("."),
				mensagem: issue.message,
			})),
		});
	}

	// Prisma — erros conhecidos (foreign key, unique constraint, etc.)
	if (error.code?.startsWith("P")) {
		return handlePrismaError(error, res);
	}

	// Multer — erros de upload (tamanho, tipo de arquivo)
	if (error.name === "MulterError") {
		return res.status(400).json({ error: mapMulterError(error) });
	}

	// Erros do Cloudinary costumam vir como objeto plano, não Error de verdade
	if (error?.http_code) {
		return res.status(502).json({ error: "Falha ao processar upload de imagem." });
	}

	// Erro genérico não mapeado — nunca vaza detalhes internos pro cliente
	return res.status(error.status || 500).json({
		error: error.status ? error.message : "Erro interno do servidor",
	});
}

function handlePrismaError(error, res) {
	switch (error.code) {
		case "P2002": // unique constraint
			return res.status(409).json({
				error: `Já existe um registro com esse ${error.meta?.target?.join(", ") || "valor"}.`,
			});
		case "P2003": // foreign key constraint
			return res.status(400).json({ error: "Referência inválida — verifique os IDs informados." });
		case "P2025": // registro não encontrado (ex: update/delete de algo que não existe)
			return res.status(404).json({ error: "Registro não encontrado." });
		default:
			return res.status(500).json({ error: "Erro ao acessar o banco de dados." });
	}
}

function mapMulterError(error) {
	if (error.code === "LIMIT_FILE_SIZE") {
		return "Imagem excede o tamanho máximo de 2MB.";
	}
	return error.message || "Erro ao processar o arquivo enviado.";
}

export { handleError };
export default handleError;
